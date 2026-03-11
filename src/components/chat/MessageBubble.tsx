"use client";

import React, { useMemo } from "react";
import type { Message } from "@/lib/types";
import { useTypewriter } from "@/hooks/useTypewriter";

function formatInline(text: string, keyPrefix: string) {
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\(?https?:\/\/[^\s)]+\)?)/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(
        <span key={`${keyPrefix}-t${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }

    if (match[2]) {
      result.push(
        <strong key={`${keyPrefix}-b${match.index}`} className="font-semibold text-[var(--text-primary)]">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      result.push(
        <em key={`${keyPrefix}-i${match.index}`}>{match[3]}</em>
      );
    } else {
      let url = match[0];
      let displayUrl = url;

      if (url.startsWith('(') && url.endsWith(')')) {
        url = url.slice(1, -1);
        displayUrl = url;
      }

      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }

      result.push(
        <a
          key={`${keyPrefix}-u${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-secondary)] underline underline-offset-2 hover:text-[var(--text-primary)] transition-colors break-all"
        >
          {displayUrl}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(
      <span key={`${keyPrefix}-t${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return result.length > 0 ? result : text;
}

function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && "\n"}
      {formatInline(line, `l${i}`)}
    </span>
  ));
}

interface MessageBubbleProps {
  message: Message;
  animate?: boolean;
}

const MessageBubble = React.memo(function MessageBubble({ message, animate = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const { displayed, isDone } = useTypewriter(
    message.content,
    animate && !isUser
  );

  const content = animate && !isUser ? displayed : message.content;
  const rendered = useMemo(() => renderContent(content), [content]);

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} message-enter`}>
      {isUser ? (
        <div className="max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl bg-[var(--user-msg-bg)] text-[var(--user-msg-text)]">
          <p className="whitespace-pre-wrap text-sm leading-relaxed wrap-break-word">
            {rendered}
          </p>
        </div>
      ) : (
        <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[80%]">
          <p
            className={`whitespace-pre-wrap text-sm sm:text-[15px] leading-relaxed text-[var(--text-primary)] wrap-break-word ${
              animate && !isDone ? "cursor-blink" : ""
            }`}
          >
            {rendered}
          </p>
        </div>
      )}
    </div>
  );
});

export default MessageBubble;
