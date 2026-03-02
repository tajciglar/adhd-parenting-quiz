import { motion } from "framer-motion";

interface ChatWelcomeProps {
  childName: string;
  onStarterClick: (message: string) => void;
}

export default function ChatWelcome({
  childName,
  onStarterClick,
}: ChatWelcomeProps) {
  const name = childName || "your child";

  const starters = [
    `How can I help ${name} with homework?`,
    "Tips for morning routines",
    "Managing screen time",
    `Understanding ${name}'s emotions`,
  ];

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className="text-3xl font-bold text-harbor-primary mb-2">
            Hi there!
          </h1>
          <p className="text-harbor-text/50 text-lg mb-10">
            Ready to talk about {name}? I'm here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {starters.map((starter, i) => (
            <motion.button
              key={starter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.15 + i * 0.08,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={() => onStarterClick(starter)}
              className="text-left p-4 rounded-xl border border-harbor-text/10 bg-white hover:border-harbor-accent/40 hover:shadow-sm transition-all cursor-pointer"
            >
              <p className="text-harbor-text text-sm">{starter}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
