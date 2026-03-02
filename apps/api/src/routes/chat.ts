import type { FastifyInstance } from "fastify";
import { z } from "zod";

const chatBodySchema = z.object({
  message: z.string().min(1).max(5000),
  conversationId: z.string().uuid().optional(),
});

type ChatBody = z.infer<typeof chatBodySchema>;

export default async function chatRoutes(fastify: FastifyInstance) {
  // GET /conversations — list user's conversations
  fastify.get(
    "/conversations",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user.id;

      const conversations = await fastify.prisma.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return reply.send({ conversations });
    },
  );

  // GET /conversations/:id/messages — get all messages for a conversation
  fastify.get<{ Params: { id: string } }>(
    "/conversations/:id/messages",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user.id;
      const { id } = request.params;

      const conversation = await fastify.prisma.conversation.findFirst({
        where: { id, userId },
      });

      if (!conversation) {
        return reply.status(404).send({ error: "Conversation not found" });
      }

      const messages = await fastify.prisma.message.findMany({
        where: { conversationId: id },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      });

      return reply.send({ messages });
    },
  );

  // DELETE /conversations/:id — delete a conversation
  fastify.delete<{ Params: { id: string } }>(
    "/conversations/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user.id;
      const { id } = request.params;

      const conversation = await fastify.prisma.conversation.findFirst({
        where: { id, userId },
      });

      if (!conversation) {
        return reply.status(404).send({ error: "Conversation not found" });
      }

      await fastify.prisma.conversation.delete({ where: { id } });

      return reply.send({ success: true });
    },
  );

  // POST /chat — send a message and get a response
  fastify.post<{ Body: ChatBody }>(
    "/chat",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = chatBodySchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.status(400).send({
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { message, conversationId } = parsed.data;
      const userId = request.user.id;

      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return reply.status(403).send({
          error: "User has not completed onboarding",
        });
      }

      let conversation: { id: string };

      if (conversationId) {
        const existing = await fastify.prisma.conversation.findFirst({
          where: { id: conversationId, userId },
        });

        if (!existing) {
          return reply.status(404).send({
            error: "Conversation not found",
          });
        }

        conversation = existing;
      } else {
        // Generate title from the first message (truncate to 60 chars)
        const title =
          message.length > 60 ? message.substring(0, 57) + "..." : message;

        conversation = await fastify.prisma.conversation.create({
          data: { userId, title },
        });
      }

      const userMessage = await fastify.prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "USER",
          content: message,
        },
      });

      // TODO: integrate with AI service for actual response generation
      const assistantContent =
        "I received your message. AI integration is pending — this is a placeholder response. Once the knowledge base is connected, I'll be able to help with ADHD-related questions!";

      const assistantMessage = await fastify.prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "ASSISTANT",
          content: assistantContent,
        },
      });

      // Touch updatedAt on conversation
      await fastify.prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });

      return reply.status(200).send({
        conversationId: conversation.id,
        userMessage: {
          id: userMessage.id,
          role: userMessage.role,
          content: userMessage.content,
          createdAt: userMessage.createdAt,
        },
        assistantMessage: {
          id: assistantMessage.id,
          role: assistantMessage.role,
          content: assistantMessage.content,
          createdAt: assistantMessage.createdAt,
        },
      });
    },
  );
}
