// @ts-nocheck
import React from "react";
import { Document, Page, StyleSheet, Text, View, Svg, Circle, Path, Image, Font } from "@react-pdf/renderer";

Font.registerHyphenationCallback(word => [word]);

// Register Raleway font family
Font.register({
  family: "Raleway",
  fonts: [
    { src: "https://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaooCP.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvoooCP.ttf", fontWeight: 500 },
    { src: "https://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVsEpYCP.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pYCP.ttf", fontWeight: 700 },
    { src: "https://fonts.gstatic.com/s/raleway/v37/1Pt_g8zYS_SKggPNyCgSQamb1W0lwk4S4WjMPrQ.ttf", fontWeight: 400, fontStyle: "italic" },
  ],
});

// Register handwritten font for quotes
Font.register({
  family: "Caveat",
  src: "https://fonts.gstatic.com/s/caveat/v23/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9SII.ttf",
  fontWeight: 400,
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ANIMAL_IMAGE: Record<string, string> = {
  koala: path.resolve(__dirname, "../../../../web/public/animals/koala.png"),
  hummingbird: path.resolve(__dirname, "../../../../web/public/animals/hummingbird.png"),
  tiger: path.resolve(__dirname, "../../../../web/public/animals/tiger.png"),
  meerkat: path.resolve(__dirname, "../../../../web/public/animals/meerkat.png"),
  stallion: path.resolve(__dirname, "../../../../web/public/animals/stallion.png"),
  fox: path.resolve(__dirname, "../../../../web/public/animals/fox.png"),
  rabbit: path.resolve(__dirname, "../../../../web/public/animals/rabbit.png"),
  elephant: path.resolve(__dirname, "../../../../web/public/animals/elephant.png"),
  dolphin: path.resolve(__dirname, "../../../../web/public/animals/dolphin.png"),
  hedgehog: path.resolve(__dirname, "../../../../web/public/animals/hedgehog.png"),
  bull: path.resolve(__dirname, "../../../../web/public/animals/bull.png"),
  red_panda: path.resolve(__dirname, "../../../../web/public/animals/redpanda.png"),
  panda: path.resolve(__dirname, "../../../../web/public/animals/cloudypanda.png"),
  firefly: path.resolve(__dirname, "../../../../web/public/animals/spark_firefly.png"),
  penguin: path.resolve(__dirname, "../../../../web/public/animals/penguin.png"),
  eagle: path.resolve(__dirname, "../../../../web/public/animals/eagle.png"),
  deer: path.resolve(__dirname, "../../../../web/public/animals/deer.png"),
  bear: path.resolve(__dirname, "../../../../web/public/animals/bear.png"),
  bee: path.resolve(__dirname, "../../../../web/public/animals/bee.png"),
  owl: path.resolve(__dirname, "../../../../web/public/animals/owl.png"),
  octopus: path.resolve(__dirname, "../../../../web/public/animals/octopus.png"),
  swan: path.resolve(__dirname, "../../../../web/public/animals/swan.png"),
  bunny: path.resolve(__dirname, "../../../../web/public/animals/bunny.png"),
  tender_hedgehog: path.resolve(__dirname, "../../../../web/public/animals/tender_hedgehog.png"),
  hidden_firefly: path.resolve(__dirname, "../../../../web/public/animals/hidden_firefly.png"),
};

import fs from "fs";
const LOGO_PATH = path.resolve(__dirname, "../../../../web/public/adhd-parenting-logo.png");
const LOGO_IMAGE = fs.existsSync(LOGO_PATH) ? LOGO_PATH : "";

/* ─── Data Interfaces ─────────────────────────────────────────────────────── */

export interface ReportTemplateData {
  archetypeId: string;
  title: string;
  innerVoiceQuote: string;
  animalDescription: string;
  aboutChild: string;
  hiddenGift: string;
  aboutBrain?: string;
  brainSections: Array<{ title: string; content: string }>;
  dayInLife: {
    morning: string;
    school: string;
    afterSchool: string;
    bedtime: string;
  };
  drains: string[];
  fuels: string[];
  overwhelm: string;
  affirmations: Array<{ when: string; say: string }>;
  doNotSay: Array<{ when: string; insteadOf: string; tryThis: string }>;
  closingLine: string;
  whatHelps?: {
    aboutChild?: string;
    hiddenGift?: string;
    brain?: string;
    morning?: string;
    school?: string;
    afterSchool?: string;
    bedtime?: string;
    overwhelm?: string;
  };
}

interface ReportDocumentProps {
  report: ReportTemplateData;
  childName: string;
  reportDate?: string; // e.g. "18 Mar 2026"
}

/* ─── Theme ───────────────────────────────────────────────────────────────── */

interface ReportTheme {
  bg: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentDark: string;
  softAccent: string;
  dangerAccent: string;
  dangerSoft: string;
  successAccent: string;
  successSoft: string;
}

const DEFAULT_THEME: ReportTheme = {
  bg: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#6B7B86",
  border: "#D8DDE0",
  accent: "#7B2D8E",
  accentDark: "#5A1D6A",
  softAccent: "#F0E6F6",
  dangerAccent: "#C0392B",
  dangerSoft: "#FDEDEC",
  successAccent: "#27AE60",
  successSoft: "#E8F8F0",
};

const ARCHETYPE_THEMES: Record<string, Partial<ReportTheme>> = {
  koala: {
    accent: "#5E7A73",
    accentDark: "#3D5A53",
    softAccent: "#E8F1ED",
    muted: "#5B6F69",
  },
  hummingbird: {
    accent: "#D95F43",
    accentDark: "#B04530",
    softAccent: "#FFE7DF",
    muted: "#8C5040",
  },
  tiger: {
    accent: "#C97316",
    accentDark: "#A35D0F",
    softAccent: "#FFEFD9",
    muted: "#8A5A2F",
  },
  meerkat: {
    accent: "#A06A3C",
    accentDark: "#7C5028",
    softAccent: "#F5E8DA",
    muted: "#7B5C42",
  },
  stallion: {
    accent: "#4B5D8A",
    accentDark: "#354468",
    softAccent: "#E8ECF8",
    muted: "#4F5E7C",
  },
  fox: {
    accent: "#B65A2C",
    accentDark: "#8E4520",
    softAccent: "#FBE6DC",
    muted: "#7A4D37",
  },
  rabbit: {
    accent: "#E07B4C",
    accentDark: "#B8613A",
    softAccent: "#FDE8DC",
    muted: "#8C5A3E",
  },
  elephant: {
    accent: "#6B7FA3",
    accentDark: "#4E5F7E",
    softAccent: "#E6ECF4",
    muted: "#5A6B82",
  },
  dolphin: {
    accent: "#2E9AAA",
    accentDark: "#1F7585",
    softAccent: "#DDF1F4",
    muted: "#3A7A86",
  },
  hedgehog: {
    accent: "#8A6BAE",
    accentDark: "#6A4E8C",
    softAccent: "#EDE4F6",
    muted: "#6E5A83",
  },
  bull: {
    accent: "#C44D4D",
    accentDark: "#9A3636",
    softAccent: "#FAE3E3",
    muted: "#8A4242",
  },
  red_panda: {
    accent: "#C96B4F",
    accentDark: "#A0523A",
    softAccent: "#FCE8E0",
    muted: "#8A5540",
  },
  panda: {
    accent: "#6B8E8A",
    accentDark: "#4A6B67",
    softAccent: "#E6F0EE",
    muted: "#5A7A76",
  },
  firefly: {
    accent: "#D4A843",
    accentDark: "#A88530",
    softAccent: "#FDF3DD",
    muted: "#8A7035",
  },
  penguin: {
    accent: "#4A7E9E",
    accentDark: "#35607A",
    softAccent: "#E2EFF6",
    muted: "#4A6E82",
  },
  eagle: {
    accent: "#5C6E8A",
    accentDark: "#3E4F68",
    softAccent: "#E6ECF2",
    muted: "#4E5E72",
  },
  deer: {
    accent: "#7A9A6A",
    accentDark: "#5A7A4E",
    softAccent: "#E8F2E4",
    muted: "#5E7A55",
  },
  bear: {
    accent: "#8B6B4A",
    accentDark: "#6B5038",
    softAccent: "#F2E8DC",
    muted: "#7A5E45",
  },
  bee: {
    accent: "#E0A832",
    accentDark: "#B88828",
    softAccent: "#FFF5D9",
    muted: "#8A7030",
  },
  owl: {
    accent: "#5A6E88",
    accentDark: "#3E4F66",
    softAccent: "#E4ECF4",
    muted: "#4A5E72",
  },
  octopus: {
    accent: "#7B5EA7",
    accentDark: "#5D4585",
    softAccent: "#EDE4F8",
    muted: "#6A5088",
  },
  swan: {
    accent: "#7A9A6A",
    accentDark: "#5A7A4E",
    softAccent: "#E8F2E4",
    muted: "#5E7A55",
  },
  bunny: {
    accent: "#B08A9A",
    accentDark: "#8A6878",
    softAccent: "#F4EAF0",
    muted: "#7A6070",
  },
  tender_hedgehog: {
    accent: "#8A6BAE",
    accentDark: "#6A4E8C",
    softAccent: "#EDE4F6",
    muted: "#6E5A83",
  },
  hidden_firefly: {
    accent: "#D4A843",
    accentDark: "#A88530",
    softAccent: "#FDF3DD",
    muted: "#8A7035",
  },
};

function getTheme(archetypeId: string): ReportTheme {
  return { ...DEFAULT_THEME, ...(ARCHETYPE_THEMES[archetypeId] ?? {}) };
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */

const s = StyleSheet.create({
  /* Page defaults */
  page: {
    paddingTop: 50,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "Raleway",
    fontWeight: 500,
  },
  coverPage: {
    paddingTop: 0,
    paddingBottom: 56,
    paddingHorizontal: 0,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "Raleway",
    fontWeight: 500,
  },

  /* ── Cover Hero ──────────────────────────── */
  heroSection: {
    paddingTop: 20,
    paddingBottom: 4,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  heroBrandRow: {
    position: "absolute",
    top: 22,
    right: 48,
    alignItems: "flex-end",
  },
  heroDateRow: {
    position: "absolute",
    top: 22,
    left: 48,
    alignItems: "flex-start",
  },
  heroDate: {
    fontSize: 8.5,
    letterSpacing: 0.3,
  },
  heroBrand: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.3,
    fontFamily: "Raleway",
    lineHeight: 1.1,
  },
  heroBrandSub: {
    fontSize: 7,
    marginTop: -1,
    lineHeight: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "Raleway",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
  },
  heroLine: {
    height: 2,
    width: "100%",
    marginBottom: 12,
  },
  heroQuoteBox: {
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  heroQuoteImage: {
    width: 75,
    height: 75,
    marginRight: 12,
    objectFit: "contain",
  },
  heroQuoteRight: {
    flex: 1,
  },
  heroQuote: {
    fontSize: 15,
    fontFamily: "Caveat",
    textAlign: "left",
    lineHeight: 1.4,
  },
  heroAttribution: {
    fontSize: 11,
    marginTop: 8,
    textAlign: "left",
  },
  coverContent: {
    paddingHorizontal: 48,
    paddingTop: 16,
  },

  /* ── Header / Footer ─────────────────────── */
  header: {
    position: "absolute",
    top: 20,
    right: 48,
    alignItems: "flex-end",
  },
  headerBrand: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.3,
    fontFamily: "Raleway",
    lineHeight: 1.1,
  },
  headerSub: {
    fontSize: 7,
    marginTop: -1,
    lineHeight: 1,
  },
  footer: {
    position: "absolute",
    top: 800,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopStyle: "solid",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    letterSpacing: 0.3,
  },
  footerPage: {
    fontSize: 8,
    fontWeight: 700,
    fontFamily: "Raleway",
  },

  /* ── Section Labels ──────────────────────── */
  sectionLabel: {
    fontSize: 9.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontFamily: "Raleway",
    marginBottom: 4,
    marginTop: 24,
  },
  sectionLabelFirst: {
    marginTop: 0,
  },
  sectionUnderline: {
    height: 1.5,
    marginBottom: 12,
    width: 40,
  },

  /* ── Body Text ───────────────────────────── */
  paragraph: {
    fontSize: 11.5,
    lineHeight: 1.6,
  },
  paragraphSpaced: {
    fontSize: 11.5,
    lineHeight: 1.6,
    marginTop: 8,
  },

  /* ── Sub-section ─────────────────────────── */
  subSection: {
    marginBottom: 14,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "Raleway",
    marginBottom: 3,
  },

  /* ── Drains / Fuels ──────────────────────── */
  dfHeader: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dfHeaderIcon: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "Raleway",
    marginRight: 6,
  },
  dfHeaderText: {
    fontSize: 8.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Raleway",
  },
  dfItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 10.5,
    lineHeight: 1.45,
  },

  /* ── Closing ─────────────────────────────── */
  closingWrapper: {
    marginTop: 32,
    alignItems: "center",
  },
  closingDivider: {
    height: 1,
    width: "100%",
    marginBottom: 14,
  },
  closingDividerBottom: {
    height: 1,
    width: "100%",
    marginTop: 14,
  },
  closingText: {
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 1.6,
  },
});

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */

function CheckIcon({ size = 11, color = "#27AE60" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="12" fill={color} />
      <Path d="M7 12.5l3.5 3.5 7-7" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function XIcon({ size = 11, color = "#C0392B" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="12" fill={color} />
      <Path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

/* ─── Helper Components ───────────────────────────────────────────────────── */

/** Replace double-hyphen or long dashes with a proper short en-dash */
function fixDashes(text: string): string {
  return text.replace(/\u2014/g, "\u2013").replace(/--/g, "\u2013");
}

function ParagraphText({ text }: { text: string }) {
  const paragraphs = fixDashes(text).split("\n").filter((p) => p.trim().length > 0);
  return (
    <View>
      {paragraphs.map((para, i) => (
        <Text key={i} style={i === 0 ? s.paragraph : s.paragraphSpaced}>
          {para}
        </Text>
      ))}
    </View>
  );
}

function WhatHelpsBox({ text, theme }: { text?: string; theme: ReportTheme }) {
  if (!text) return null;
  return (
    <View
      wrap={false}
      style={{
        marginTop: 10,
        marginBottom: 6,
        borderLeftWidth: 3,
        borderLeftColor: theme.successAccent,
        borderLeftStyle: "solid",
        backgroundColor: theme.successSoft,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 3,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          fontWeight: 700,
          fontFamily: "Raleway",
          color: theme.successAccent,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          marginBottom: 4,
        }}
      >
        What Helps
      </Text>
      <Text style={{ fontSize: 10.5, lineHeight: 1.5, color: theme.text }}>
        {fixDashes(text)}
      </Text>
    </View>
  );
}

function SectionLabel({
  text,
  theme,
  first,
}: {
  text: string;
  theme: ReportTheme;
  first?: boolean;
}) {
  return (
    <View wrap={false} minPresenceAhead={200}>
      <Text
        style={[
          s.sectionLabel,
          { color: theme.accent },
          first ? s.sectionLabelFirst : {},
        ]}
      >
        {text}
      </Text>
      <View style={[s.sectionUnderline, { backgroundColor: theme.accent }]} />
    </View>
  );
}

function Header({ theme }: { theme: ReportTheme }) {
  return (
    <View style={s.header} fixed>
      <Text style={[s.headerBrand, { color: theme.accent }]}>ADHD PERSONALITY REPORT</Text>
      <Text style={[s.headerSub, { color: theme.muted }]}>
        Your child's unique profile
      </Text>
    </View>
  );
}

function DynamicFooter({ theme }: { theme: ReportTheme }) {
  return (
    <>
      {/* Logo in separate fixed container (Image doesn't work inside fixed flex rows) */}
      {LOGO_IMAGE && (
        <View style={{ position: "absolute", top: 808, left: 48 }} fixed>
          <Image src={LOGO_IMAGE} style={{ width: 50, height: 20, objectFit: "contain" }} />
        </View>
      )}
      <View style={[s.footer, { borderTopColor: theme.border }]} fixed>
        <View style={{ width: 50 }} />
        <View style={{ flex: 1 }} />
        {/* Right-aligned page number */}
        <Text
          style={[s.footerPage, { color: theme.accent, width: 30, textAlign: "right" }]}
          render={({ pageNumber }) => `${pageNumber}`}
        />
      </View>
    </>
  );
}

/* ─── Table helper for affirmations (When / Say) ─────────────────────────── */

function AffirmationsTable({
  affirmations,
  theme,
}: {
  affirmations: Array<{ when: string; say: string }>;
  theme: ReportTheme;
}) {
  const headerStyle = {
    fontSize: 8.5,
    fontWeight: 700 as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    fontFamily: "Raleway",
  };

  return (
    <View style={{ marginTop: 4 }}>
      {/* Header row */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, backgroundColor: theme.softAccent, paddingVertical: 7, paddingHorizontal: 10 }}>
          <Text style={{ ...headerStyle, color: theme.accent }}>WHEN...</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: theme.softAccent, paddingVertical: 7, paddingHorizontal: 10 }}>
          <Text style={{ ...headerStyle, color: theme.accent }}>SAY...</Text>
        </View>
      </View>
      {affirmations.map((aff, i) => (
        <View key={`aff-${i}`} wrap={false} style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomStyle: "solid", borderBottomColor: theme.border }}>
          <View style={{ flex: 1, paddingVertical: 7, paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 10.5, lineHeight: 1.45 }}>{fixDashes(aff.when)}</Text>
          </View>
          <View style={{ flex: 1, paddingVertical: 7, paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 10.5, lineHeight: 1.45, fontStyle: "italic" }}>{fixDashes(aff.say)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ─── 3-column "What Not to Say" table ──────────────────────────────────── */

function DoNotSayTable({
  items,
  theme,
}: {
  items: Array<{ when: string; insteadOf: string; tryThis: string }>;
  theme: ReportTheme;
}) {
  const headerBase = {
    fontSize: 8,
    fontWeight: 700 as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    fontFamily: "Raleway",
  };

  return (
    <View style={{ marginTop: 4 }}>
      {/* Header row */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, backgroundColor: theme.softAccent, paddingVertical: 7, paddingHorizontal: 8 }}>
          <Text style={{ ...headerBase, color: theme.accent }}>WHEN THIS HAPPENS...</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: theme.dangerSoft, paddingVertical: 7, paddingHorizontal: 8, flexDirection: "row", alignItems: "center" }}>
          <Text style={{ ...headerBase, color: theme.dangerAccent }}>INSTEAD OF...</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: theme.successSoft, paddingVertical: 7, paddingHorizontal: 8, flexDirection: "row", alignItems: "center" }}>
          <Text style={{ ...headerBase, color: theme.successAccent }}>TRY...</Text>
        </View>
      </View>
      {/* Data rows */}
      {items.map((pair, i) => (
        <View
          key={`say-${i}`}
          wrap={false}
          style={{
            flexDirection: "row",
            borderBottomWidth: 0.5,
            borderBottomStyle: "solid",
            borderBottomColor: theme.border,
          }}
        >
          <View style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 8 }}>
            <Text style={{ fontSize: 10, lineHeight: 1.4 }}>{fixDashes(pair.when)}</Text>
          </View>
          <View style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 8, flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ width: 14, paddingTop: 1 }}><XIcon size={8} color={theme.dangerAccent} /></View>
            <Text style={{ flex: 1, fontSize: 10, lineHeight: 1.4 }}>{fixDashes(pair.insteadOf)}</Text>
          </View>
          <View style={{ flex: 1, paddingVertical: 6, paddingHorizontal: 8, flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ width: 14, paddingTop: 1 }}><CheckIcon size={8} color={theme.successAccent} /></View>
            <Text style={{ flex: 1, fontSize: 10, lineHeight: 1.4 }}>{fixDashes(pair.tryThis)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ─── Main Document ───────────────────────────────────────────────────────── */

export function ReportDocument({ report, childName, reportDate }: ReportDocumentProps) {
  const theme = getTheme(report.archetypeId);
  const NAME = childName.trim().toUpperCase();
  const formattedDate = reportDate ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Document title={`${childName.trim()} ${report.title}`}>
      {/* ════════════════ PAGE 1 — COVER ════════════════ */}
      <Page
        size="A4"
        style={[s.coverPage, { backgroundColor: theme.bg, color: theme.text }]}
        wrap
      >
        {/* Hero Section */}
        <View style={s.heroSection}>
          {/* Date — top left */}
          <View style={s.heroDateRow}>
            <Text style={[s.heroDate, { color: theme.muted }]}>{formattedDate}</Text>
          </View>
          {/* Brand — top right */}
          <View style={s.heroBrandRow}>
            <Text style={[s.heroBrand, { color: theme.accent }]}>ADHD PERSONALITY REPORT</Text>
            <Text style={[s.heroBrandSub, { color: theme.muted }]}>
              Your child's unique profile
            </Text>
          </View>
          {/* Animal title */}
          <Text style={[s.heroTitle, { color: theme.accent }]}>
            {report.title}
          </Text>
          <View style={[s.heroLine, { backgroundColor: theme.accent }]} />
          <View style={[s.heroQuoteBox, { backgroundColor: theme.softAccent }]}>
            {ANIMAL_IMAGE[report.archetypeId] && (
              <Image src={ANIMAL_IMAGE[report.archetypeId]} style={s.heroQuoteImage} />
            )}
            <View style={s.heroQuoteRight}>
              <Text style={[s.heroQuote, { color: theme.text }]}>
                {`\u201C${report.innerVoiceQuote.trim()}\u201D`}
              </Text>
              <Text style={[s.heroAttribution, { color: theme.muted }]}>
                {`\u2013 ${childName}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Content below hero */}
        <View style={s.coverContent}>
          <SectionLabel text="THE ANIMAL" theme={theme} first />
          <ParagraphText text={report.animalDescription} />

          <SectionLabel text={`ABOUT ${NAME}`} theme={theme} />
          <ParagraphText text={report.aboutChild} />
          <WhatHelpsBox text={report.whatHelps?.aboutChild} theme={theme} />
        </View>

        <DynamicFooter theme={theme} />
      </Page>

      {/* ════════════════ PAGES 2+ — ALL REMAINING CONTENT ════════════════ */}
      <Page
        size="A4"
        style={[s.page, { backgroundColor: theme.bg, color: theme.text }]}
        wrap
      >
        <Header theme={theme} />
        <DynamicFooter theme={theme} />

        {/* ── Hidden Gift ── */}
        <SectionLabel text={`${NAME}'S HIDDEN GIFT`} theme={theme} first />
        <ParagraphText text={report.hiddenGift} />
        <WhatHelpsBox text={report.whatHelps?.hiddenGift} theme={theme} />

        {/* ── Understanding Brain ── */}
        <SectionLabel text={`UNDERSTANDING ${NAME}'S BRAIN`} theme={theme} />
        {report.aboutBrain && <ParagraphText text={report.aboutBrain} />}
        {report.brainSections.map((section, idx) => {
          const ordinal = idx === 0 ? "The first is" : "The second is";
          const titleLower = section.title.toLowerCase();
          const startsUpper = /^[A-Z\[]/.test(section.content);
          const separator = startsUpper ? ". " : " \u2013 ";
          return (
            <View key={section.title} style={s.subSection} wrap={false}>
              <Text style={{ fontSize: 11.5, lineHeight: 1.6, marginTop: 8 }}>
                <Text style={{ fontWeight: 700, fontFamily: "Raleway", fontSize: 11.5 }}>
                  {`${ordinal} ${titleLower}`}
                </Text>
                {`${separator}${fixDashes(section.content)}`}
              </Text>
            </View>
          );
        })}
        <WhatHelpsBox text={report.whatHelps?.brain} theme={theme} />

        {/* ── A Day in Life ── */}
        <SectionLabel text={`A DAY IN ${NAME}'S LIFE`} theme={theme} />
        {[
          { label: "Morning", text: report.dayInLife.morning, helps: report.whatHelps?.morning },
          { label: "School", text: report.dayInLife.school, helps: report.whatHelps?.school },
          { label: "After School", text: report.dayInLife.afterSchool, helps: report.whatHelps?.afterSchool },
          { label: "Bedtime", text: report.dayInLife.bedtime, helps: report.whatHelps?.bedtime },
        ].map((block) => (
          <View key={block.label} style={s.subSection}>
            <View wrap={false}>
              <Text style={[s.subTitle, { color: theme.accent }]}>
                {block.label}
              </Text>
              <ParagraphText text={block.text} />
            </View>
            <WhatHelpsBox text={block.helps} theme={theme} />
          </View>
        ))}

        {/* ── Drains / Fuels ── */}
        <View wrap={false}>
        <SectionLabel
          text={`CREATING THE RIGHT ENVIRONMENT FOR ${NAME} TO THRIVE`}
          theme={theme}
        />
        <View>
          {/* Headers row */}
          <View style={{ flexDirection: "row" }}>
            <View style={[s.dfHeader, { flex: 1, backgroundColor: theme.dangerSoft }]}>
              <Image src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1faab.png" style={{ width: 14, height: 14, marginRight: 5 }} />
              <Text style={[s.dfHeaderText, { color: theme.dangerAccent }]}>
                WHAT DRAINS {NAME}
              </Text>
            </View>
            <View style={[s.dfHeader, { flex: 1, backgroundColor: theme.successSoft }]}>
              <Image src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f50b.png" style={{ width: 14, height: 14, marginRight: 5 }} />
              <Text style={[s.dfHeaderText, { color: theme.successAccent }]}>
                WHAT FUELS {NAME}
              </Text>
            </View>
          </View>
          {/* Item rows */}
          {report.drains.map((drain, i) => {
            const fuel = report.fuels[i] ?? "";
            return (
              <View key={`df-${i}`} wrap={false} style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomStyle: "solid", borderBottomColor: theme.border }}>
                <View style={[s.dfItem, { flex: 1, flexDirection: "row", alignItems: "flex-start" }]}>
                  <View style={{ width: 16, paddingTop: 1 }}><XIcon size={9} color={theme.dangerAccent} /></View>
                  <Text style={{ flex: 1, fontSize: 10.5, lineHeight: 1.45 }}>{fixDashes(drain)}</Text>
                </View>
                <View style={[s.dfItem, { flex: 1, flexDirection: "row", alignItems: "flex-start" }]}>
                  <View style={{ width: 16, paddingTop: 1 }}><CheckIcon size={9} color={theme.successAccent} /></View>
                  <Text style={{ flex: 1, fontSize: 10.5, lineHeight: 1.45 }}>{fixDashes(fuel)}</Text>
                </View>
              </View>
            );
          })}
          {report.fuels.slice(report.drains.length).map((fuel, i) => (
            <View key={`df-extra-${i}`} style={{ flexDirection: "row", borderBottomWidth: 0.5, borderBottomStyle: "solid", borderBottomColor: theme.border }}>
              <View style={[s.dfItem, { flex: 1 }]} />
              <View style={[s.dfItem, { flex: 1, flexDirection: "row", alignItems: "flex-start" }]}>
                <View style={{ width: 16, paddingTop: 1 }}><CheckIcon size={9} color={theme.successAccent} /></View>
                <Text style={{ flex: 1, fontSize: 10.5, lineHeight: 1.45 }}>{fixDashes(fuel)}</Text>
              </View>
            </View>
          ))}
        </View>
        </View>

        {/* ── Overwhelm ── */}
        <SectionLabel text={`WHEN ${NAME} GETS OVERWHELMED`} theme={theme} />
        <ParagraphText text={
          report.overwhelm.replace(
            new RegExp(`^\\s*when\\s+${NAME}\\s+gets\\s+overwhelmed\\s*`, "i"),
            "",
          )
        } />
        <WhatHelpsBox text={report.whatHelps?.overwhelm} theme={theme} />

        {/* ── Affirmations (When / Say table) ── */}
        <SectionLabel text={`WHAT ${NAME} NEEDS TO HEAR MOST`} theme={theme} />
        <AffirmationsTable affirmations={report.affirmations} theme={theme} />

        {/* ── What Not to Say (2-column table) ── */}
        <SectionLabel text="WHAT NOT TO SAY AND WHAT TO SAY INSTEAD" theme={theme} />
        <DoNotSayTable items={report.doNotSay} theme={theme} />

        {/* ── Closing ── */}
        <View style={s.closingWrapper} wrap={false}>
          <Text style={[s.closingText, { color: theme.accent }]}>
            {report.closingLine}
          </Text>
          <View style={[s.closingDividerBottom, { backgroundColor: theme.accent }]} />
        </View>

        {/* ── Disclaimer ── fixed just above footer on last page */}
        <View style={{ position: "absolute", bottom: 60, left: 48, right: 48 }} fixed={false}>
          <Text style={{ fontSize: 7.5, lineHeight: 1.4, color: theme.muted, textAlign: "center" }}>
            This report is for informational and educational purposes only. It is not a clinical assessment, diagnosis, or substitute for professional evaluation. If you have concerns about your child's development, please consult a qualified healthcare provider.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default ReportDocument;
