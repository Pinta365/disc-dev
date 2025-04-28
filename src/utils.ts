// Logger utility for the Discord client library
// Usage examples and log level guidance included below.

export enum LogLevel {
    ERROR = 0, // Only errors that require immediate attention
    WARN = 1,  // Warnings and errors
    INFO = 2,  // General information about normal operations
    DEBUG = 3, // Detailed debug information for development
    TRACE = 4, // Very fine-grained trace information for deep debugging
}

/**
 * Example usage:
 * 
 * Logger.setLevel(LogLevel.DEBUG); // Show debug and above
 * Logger.enable(); // Enable logging
 * Logger.info("Bot started");
 * Logger.debug("Gateway payload received", payload);
 * Logger.error("Failed to connect", error);
 * 
 * // Custom log handler (optional)
 * Logger.setHandler((level, ...args) => {
 *   // Send logs to a file, external service, etc.
 * });
 * 
 * // To disable all logging:
 * Logger.disable();
 * 
 * // Log level guidance:
 * // - ERROR: Use for critical failures (e.g., cannot connect, unhandled exceptions)
 * // - WARN: Use for recoverable issues or unexpected states (e.g., reconnecting, deprecated usage)
 * // - INFO: Use for major lifecycle events (e.g., bot ready, command registered)
 * // - DEBUG: Use for development details (e.g., payloads, state changes)
 * // - TRACE: Use for step-by-step tracing (e.g., function entry/exit, variable values)
 */

type LogHandler = (level: LogLevel, ...args: unknown[]) => void;

export class Logger {
    private static enabled = true;
    private static level: LogLevel = LogLevel.WARN;
    private static handler: LogHandler = Logger.defaultHandler;

    static setLevel(level: LogLevel) {
        Logger.level = level;
    }

    static enable() {
        Logger.enabled = true;
    }

    static disable() {
        Logger.enabled = false;
    }

    static setHandler(handler: LogHandler) {
        Logger.handler = handler;
    }

    static error(...args: unknown[]) {
        Logger.log(LogLevel.ERROR, ...args);
    }

    static warn(...args: unknown[]) {
        Logger.log(LogLevel.WARN, ...args);
    }

    static info(...args: unknown[]) {
        Logger.log(LogLevel.INFO, ...args);
    }

    static debug(...args: unknown[]) {
        Logger.log(LogLevel.DEBUG, ...args);
    }

    static trace(...args: unknown[]) {
        Logger.log(LogLevel.TRACE, ...args);
    }

    private static log(level: LogLevel, ...args: unknown[]) {
        if (!Logger.enabled || level > Logger.level) return;
        Logger.handler(level, ...args);
    }

    private static defaultHandler(level: LogLevel, ...args: unknown[]) {
        const levelStr = LogLevel[level];
        const color = Logger.getColor(level);
        const timestamp = new Date().toISOString();
        // eslint-disable-next-line no-console
        console.log(`${color}[${timestamp}] [${levelStr}]`, ...args, "\x1b[0m");
    }

    private static getColor(level: LogLevel): string {
        switch (level) {
            case LogLevel.ERROR: return "\x1b[31m"; // Red
            case LogLevel.WARN:  return "\x1b[33m"; // Yellow
            case LogLevel.INFO:  return "\x1b[36m"; // Cyan
            case LogLevel.DEBUG: return "\x1b[35m"; // Magenta
            case LogLevel.TRACE: return "\x1b[90m"; // Gray
            default: return "";
        }
    }
}
