#!/usr/bin/env node
import { MiddleEastMap } from './map-generator.js';
import { NewsAnalyzer } from './news-analyzer.js';
import chalk from 'chalk';
import { EventEmitter } from 'events';

class MiddleEastMonitor extends EventEmitter {
    constructor() {
        super();
        this.map = new MiddleEastMap();
        this.analyzer = new NewsAnalyzer();
        this.updateCount = 0;
        this.currentEvents = [];
        this.isInitialized = false;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async typeText(text, delay = 30) {
        for (const char of text) {
            process.stdout.write(char);
            await this.sleep(delay);
        }
    }

    async showIntro() {
        console.clear();

        const quote = "War in the Middle East is not created, it transitions from one state to another";
        const author = "— Ancient Wisdom";

        console.log('\n\n');
        await this.typeText(chalk.gray(quote), 40);
        console.log('\n');
        await this.typeText(chalk.gray.italic(author), 50);
        console.log('\n\n');

        await this.sleep(1500);

        const frames = ['▱▱▱▱▱▱▱▱▱▱', '▰▱▱▱▱▱▱▱▱▱', '▰▰▱▱▱▱▱▱▱▱', '▰▰▰▱▱▱▱▱▱▱',
            '▰▰▰▰▱▱▱▱▱▱', '▰▰▰▰▰▱▱▱▱▱', '▰▰▰▰▰▰▱▱▱▱', '▰▰▰▰▰▰▰▱▱▱',
            '▰▰▰▰▰▰▰▰▱▱', '▰▰▰▰▰▰▰▰▰▱', '▰▰▰▰▰▰▰▰▰▰'];

        for (const frame of frames) {
            process.stdout.write(`\r${chalk.cyan('Initializing System')} ${chalk.gray(frame)}`);
            await this.sleep(100);
        }

        console.log('\n\n');
        await this.sleep(500);
        this.isInitialized = true;
    }

    printHeader() {
        const width = 76;
        const topBorder = chalk.gray('╔' + '═'.repeat(width) + '╗');
        const bottomBorder = chalk.gray('╚' + '═'.repeat(width) + '╝');
        const emptyLine = chalk.gray('║') + ' '.repeat(width) + chalk.gray('║');

        const title = 'MIDDLE EAST CONFLICT MONITOR';
        const subtitle = 'Real-time Event Tracking & Analysis System';

        const titlePadding = Math.floor((width - title.length) / 2);
        const subtitlePadding = Math.floor((width - subtitle.length) / 2);

        console.log(topBorder);
        console.log(emptyLine);
        console.log(
            chalk.gray('║') +
            ' '.repeat(titlePadding) +
            chalk.cyan.bold(title) +
            ' '.repeat(width - titlePadding - title.length) +
            chalk.gray('║')
        );
        console.log(emptyLine);
        console.log(
            chalk.gray('║') +
            ' '.repeat(subtitlePadding) +
            chalk.gray(subtitle) +
            ' '.repeat(width - subtitlePadding - subtitle.length) +
            chalk.gray('║')
        );
        console.log(emptyLine);
        console.log(bottomBorder);
        console.log('');
    }

    displayEvents(events) {
        console.log(chalk.bold.cyan('RECENT EVENTS') + chalk.gray(' ─── ') + chalk.gray(`${events.length} found`));
        console.log('');

        if (events.length === 0) {
            console.log(chalk.gray('  No relevant events detected in current news cycle'));
            console.log(chalk.gray('  RSS feeds may be temporarily unavailable'));
            return;
        }

        events.forEach((event) => {
            const colors = {
                attack: { border: chalk.rgb(200, 40, 40), accent: chalk.rgb(255, 100, 100) },
                tension: { border: chalk.rgb(200, 180, 40), accent: chalk.rgb(255, 220, 80) },
                peace: { border: chalk.rgb(40, 180, 90), accent: chalk.rgb(80, 255, 140) },
                neutral: { border: chalk.gray, accent: chalk.white }
            };

            const color = colors[event.eventType] || colors.neutral;
            const width = 76;

            console.log(color.border('┌' + '─'.repeat(width) + '┐'));

            const marker = this.getEventMarker(event.eventType);
            const headerText = `${color.accent(marker)} ${event.country.toUpperCase()} ${chalk.gray('·')} ${this.getEventTypeLabel(event.eventType)}`;
            const headerPlain = `${marker} ${event.country.toUpperCase()} · ${this.getEventTypePlain(event.eventType)}`;
            const headerPadding = width - this.stripAnsi(headerPlain).length - 2;

            console.log(
                color.border('│') + ' ' +
                headerText +
                ' '.repeat(headerPadding) + ' ' +
                color.border('│')
            );

            console.log(color.border('├' + '─'.repeat(width) + '┤'));

            const wrappedTitle = this.wrapText(event.title, width - 4);
            wrappedTitle.forEach(line => {
                console.log(
                    color.border('│') + '  ' +
                    chalk.white(line) +
                    ' '.repeat(width - line.length - 2) +
                    color.border('│')
                );
            });

            console.log(color.border('├' + '─'.repeat(width) + '┤'));

            const dateStr = event.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const confidenceBar = this.createConfidenceBar(event.confidence);
            const sourceDomain = this.shortenUrl(event.source);

            console.log(
                color.border('│') + '  ' +
                chalk.gray('Time: ') + chalk.white(dateStr) +
                chalk.gray('  │  ') +
                chalk.gray('Confidence: ') + confidenceBar +
                ' '.repeat(Math.max(0, width - dateStr.length - 35)) +
                color.border('│')
            );

            console.log(
                color.border('│') + '  ' +
                chalk.gray('Source: ') + chalk.blue.dim(sourceDomain) +
                ' '.repeat(width - sourceDomain.length - 10) +
                color.border('│')
            );

            console.log(color.border('└' + '─'.repeat(width) + '┘'));
            console.log('');
        });
    }

    getEventMarker(type) {
        const markers = {
            'attack': '◉',
            'tension': '●',
            'peace': '◆',
            'neutral': '•'
        };
        return markers[type] || '•';
    }

    getEventTypeLabel(type) {
        const labels = {
            'attack': chalk.rgb(255, 100, 100)('Military Conflict'),
            'tension': chalk.rgb(255, 220, 80)('Political Tension'),
            'peace': chalk.rgb(80, 255, 140)('Peace Process'),
            'neutral': chalk.white('General News')
        };
        return labels[type] || chalk.white('Unknown');
    }

    getEventTypePlain(type) {
        const labels = {
            'attack': 'Military Conflict',
            'tension': 'Political Tension',
            'peace': 'Peace Process',
            'neutral': 'General News'
        };
        return labels[type] || 'Unknown';
    }

    createConfidenceBar(confidence) {
        const barLength = 10;
        const filled = Math.round((confidence / 100) * barLength);

        let color;
        if (confidence >= 80) color = chalk.rgb(60, 255, 120);
        else if (confidence >= 60) color = chalk.rgb(220, 200, 40);
        else color = chalk.rgb(200, 100, 100);

        return color('█'.repeat(filled)) + chalk.gray('░'.repeat(barLength - filled)) +
            chalk.white(` ${confidence}%`);
    }

    wrapText(text, maxLength) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + word).length <= maxLength) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) lines.push(currentLine);
        return lines;
    }

    shortenUrl(url) {
        try {
            const urlObj = new URL(url);
            let domain = urlObj.hostname.replace('www.', '');
            if (domain.length > 40) {
                domain = domain.substring(0, 37) + '...';
            }
            return domain;
        } catch {
            return url.substring(0, 40) + '...';
        }
    }

    stripAnsi(str) {
        return str.replace(/\x1b\[[0-9;]*m/g, '');
    }

    printFooter() {
        const now = new Date();
        const timeStr = now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const divider = chalk.gray('─'.repeat(78));

        console.log(divider);
        console.log(
            chalk.gray('Last Update: ') + chalk.cyan(timeStr) +
            chalk.gray('  │  ') +
            chalk.gray('Updates: ') + chalk.white(`${this.updateCount}`)
        );
        console.log(chalk.green('● Live monitoring active'));
        console.log(chalk.gray('Press Ctrl+C to exit'));
        console.log(divider);
    }

    render() {
        if (!this.isInitialized) return;

        console.clear();
        this.printHeader();
        console.log(this.map.renderMap(this.currentEvents));
        console.log('');
        console.log(this.map.renderLegend());
        console.log('');
        console.log(this.map.renderStats(this.currentEvents));
        console.log('');
        this.displayEvents(this.currentEvents);
        this.printFooter();
    }

    async fetchData() {
        try {
            const events = await this.analyzer.analyzeFeeds();

            // Check if data actually changed
            const hasChanged = JSON.stringify(this.currentEvents) !== JSON.stringify(events);

            if (hasChanged || this.currentEvents.length === 0) {
                this.currentEvents = events;
                this.updateCount++;
                this.emit('data-updated', events);
            }

        } catch (error) {
            this.emit('error', error);
        }
    }

    startMonitoring(intervalMinutes = 10) {
        // Listen to our own events
        this.on('data-updated', () => {
            this.render();
        });

        this.on('error', (error) => {
            console.error(chalk.red('System Error:'), chalk.gray(error.message));
        });

        // Initial fetch
        this.fetchData();

        // Schedule periodic checks (but only re-render if data changed)
        const checkInterval = intervalMinutes * 60 * 1000;
        setInterval(() => {
            this.fetchData();
        }, checkInterval);
    }
}

// Main execution
const monitor = new MiddleEastMonitor();

console.log(chalk.cyan.bold('\nStarting real-time monitoring system...\n'));

(async () => {
    await monitor.showIntro();
    monitor.startMonitoring(10); // Check every 10 minutes
})();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\nShutting down monitoring system...'));
    console.log(chalk.gray('Goodbye.\n'));
    process.exit(0);
});