// map-generator.js - Clean Static Map with Color Coding
import chalk from 'chalk';

export class MiddleEastMap {
    constructor() {
        this.countryPositions = {
            'turkey': { line: 2, label: 'TR' },
            'syria': { line: 7, label: 'SY' },
            'iraq': { line: 8, label: 'IRQ' },
            'lebanon': { line: 9, label: 'LB' },
            'iran': { line: 9, label: 'IR' },
            'israel': { line: 10, label: 'ISR' },
            'jordan': { line: 11, label: 'JORD' },
            'egypt': { line: 13, label: 'EG' },
            'saudi arabia': { line: 14, label: 'SA' },
            'pakistan': { line: 13, label: 'PK' },
            'afghanistan': { line: 9, label: 'AFGH' },
            'uae': { line: 17, label: 'UAE' },
            'oman': { line: 19, label: 'OM' },
            'yemen': { line: 22, label: 'YEM' }
        };
    }

    getColorForEvent(eventType) {
        const colors = {
            'attack': chalk.rgb(255, 60, 60).bold,
            'tension': chalk.rgb(255, 220, 80).bold,
            'peace': chalk.rgb(80, 255, 140).bold,
            'neutral': chalk.rgb(200, 200, 200).bold
        };
        return colors[eventType] || chalk.white.bold;
    }

    getMarkerForEvent(eventType) {
        const markers = {
            'attack': '◉',
            'tension': '●',
            'peace': '◆',
            'neutral': '•'
        };
        return markers[eventType] || '•';
    }

    renderMap(events = []) {
        const map = `
⠀⠀⢤⣦⡄⠀⠀⠀⠀⠀⣀⣤⡤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢾⡟⡋⢓⣖⡶⣶⢻⣝⡮⢷⣭⢳⡻⣞⡶⣤⠴⣦⢴⡞⡿⡽⢷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠁⢿⢯⡟⡽⣎⡷⣭⢟⣼⣹TR⣞⢯⣳⡝⣾⡱⣟⢮⣳⢽⣳⢻⡽⣶⣄⠀⠀⠀⣠⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣆⣟⢾⡹⢧⣻⢼⣫⢶⡳⣽⣚⡧⣗⡻⣖⢯⡽⣺⢵⣫⢞⡧⣟⢶⣟⡳⣶⢞⡿⣅⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣾⣧⡟⣯⢳⣏⣞⡧⣟⢶⣫⣞⣭⢷⣫⢟⣼⢳⣏⢾⠽⢾⣭⡿⢭⡷⣝⡾⣱⣏⡧⣤⡀⠀⠀⠀⠀⢄⡴⣟⢿⣛⠶⡤⣄⡀⠀⠀⠀⠀
⠀⠀⠀⠈⠈⠉⢯⠿⠀⠉⢾⣽⡾⠉⠉⣼⣽⣿⣮⡿⣯⣿⡽⣽⣷⣽⡾⣿⣿⣼⣷⣏⣾⣱⣯⣿⣶⣶⢶⡿⣮⣽⣾⣧⣯⣿⣵⢯⡿⣶⡆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⣠⠀⠀⢻⣏SY⢻⣝⠿⣽⢯⣻⢏⡿⣭⢟⣽⣻⢼⣫⢟⡼⣛⡿⡽⣏⡿⣝⡯⣟⡽⣏⡿⣫⣟⣻⠽⠇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠀⢀⣼⡺⣏⢷⣛⡮⣿⢯⣻⡜⣯IRQ⣿⣳⠽⣎⡷⣫⡽⣳⣝⣳⢽⡺⣵⢻⣜⣳⢽⡺⣵⢫⣞⡏⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼LB⣟⣼⣻⢷⣻⢵⣫⢶⡻⣵⢫⣶⢫⣟⣯⢷⡹⢧⣻⢵IR⡮⢷⡭⣗⢯⡞⣧⠿⣜⡯⣞⡏⠀⠀⠀               AFGH
⣀⣀⣀⠀⠀⠀⠀⢀⢀⡀⠀⠀⠀⣰ISR⣏⢶⣽⣪⢯⢷⣻⢮⡷⣝⡾⣹⢎⡿⣜⢯⣾⢻⣝⢮⡗⣯⡳⣽⢳⡽⣚⣧⢟⡮⣟⡵⣻⢼⣹⡀⠀⠀
⡿⣭⢏⣟⢧⢶⡖⣿⣹⢻⣖⢶⣺⣽⢟⡾JORD⣞⡭⣷⢳⡽⣾⣭⢻⣼⢫⡾⣽⣟⡮⡷⣫⢷⣹⢞⡽⣺⡝⣮⢻⣼⢣⣟⡵⣫⢷⡙⠀⠀
⣟⡮⣟⢮⣛⣮⠽⣖⢯⡻⢦⢟⡶⡓⣟⣽⡳⣟⢶⣫⢷⣹⢮⡗⣯⢻⣥⣻⢮⣷⡷⢿⡉⠀⠀⠙⣷⡹⣞⡽⣣⡟⣵⡻⣜⢯⡞⣵⣏⢿⣀⠀⠀
⣿⢳⣭⡻⣜⡧⢿⣹⢞⡽⣫⢮⠻⠕⢻⣼⣱⣟⣮⣗⣯⣞⣣⣟⣜⡷⢮⣗⣯⣷⣻⡟⣷⠀⠀⣀⠘⠷⣹⡞⣵⣫⢷⣹⡽⢮⡽⣖⢯⣞⡳⢶⡄            PK
⣿⣣⠷⣝⣧EG⣝⣮⢻⣼⢫⣏⣇⠀⠁⠹⣾⣞⣿⣩⣹⣎⣧⣟⣏SA⢯⣹⣞⣯⢿⣟⣦⡏⠀⠀⠨⠙⠓⠽⠾⠃⢹⣏⢾⡹⣞⡼⣽⣳⠷
⣷⢏⣟⠾⣜⡯⣞⡼⣳⡭⢷⣹⢞⣆⠀⠀⠘⣞⡶⣭⣳⡝⡾⣜⣮⢽⣫⢗⣮⢳⣏⣞⣳⢮⣻⠄⣾⠀⠀⠀⠀⠀⣠⡇⠀⠘⠛⠓⠩⠳⠷⠀⠀
⣯⡟⣼⢏⡷⣝⡮⣗⢯⡞⣯⢳⣏⠾⣦⠀⠀⠙⠳⢧⡳⢯⡽⣞⡼⢧⣛⣮⢗⡯⣞⣼⢣⡿⣜⡻⣯⣄⣠⣄⣠⢾⣿⣞⣄⡀⠀⠀⠀⠀⠀⠀⠀
⣿⣹⢮⣻⢼⡳⣽⣚⣧⢿⣱⢯⡞⣯⣽⣀⠀⠀⠀⢹⡽⣳⠽⣮⡝⣯⢳⢮⣻⢼⡳⣞⡽⣺⢭⡗⣧⢗⡷⣝UAE⢷⡞⣧⢏⣯⢻⡆⡀⠀⠀⠀⠀
⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠁⠀⠀⠘⣳⡭⣟⢶⣫⢗⣯⢻⣜⣳⡽⣎⢷⣫⢷⣹⢞⡽⣺⢭⣳⢯⡿⣝⡾⣱⠿⠜⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⢷⣿⢾⣿⢿⣿⢻⡟⣿⢻⡿⣿⡟⣿⢿⣾⢻⣯⢿⣿OM⣿⢯⡿⡿⠟⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢩⡷⣭⡻⣜⡯⢾⡭⣗⢯⣳⣝⠧⣟⣮⡗⣾⢽⡳⣽⢣⡿⠹⠗⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣶⣫⢷⣹⡧⣟⣮⣟⢧⡟⡽⣎⡷⣹⣟⣮⢗⣯⠛⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠈⡿⣭⣳⡝⣞⢧YEM⣧⡻⣝⢾⣱⢿⠚⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣽⣣⢷⡹⣏⣾⡹⢶⡻⠽⠊⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢸⢧⢯⡳⠿⠖⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        `.split('\n');

        const mapCopy = [...map];

        events.forEach(event => {
            const country = event.country.toLowerCase();
            const pos = this.countryPositions[country];

            if (pos && mapCopy[pos.line]) {
                const colorFunc = this.getColorForEvent(event.eventType);
                const marker = this.getMarkerForEvent(event.eventType);

                const line = mapCopy[pos.line];
                const labelIndex = line.indexOf(pos.label);

                if (labelIndex !== -1) {
                    const before = line.substring(0, labelIndex);
                    const after = line.substring(labelIndex + pos.label.length);
                    mapCopy[pos.line] = before + colorFunc(marker + ' ' + pos.label) + after;
                }
            }
        });

        return mapCopy.join('\n');
    }

    renderLegend() {
        const divider = chalk.gray('─'.repeat(62));
        return `
${divider}
${chalk.bold.white('MAP LEGEND')}
${divider}
${chalk.rgb(255, 60, 60)('◉')} ${chalk.gray('Military Conflict')}      ${chalk.rgb(255, 220, 80)('●')} ${chalk.gray('Political Tension')}
${chalk.rgb(80, 255, 140)('◆')} ${chalk.gray('Peace Agreement')}      ${chalk.rgb(200, 200, 200)('•')} ${chalk.gray('General News')}
${divider}
        `.trim();
    }

    renderStats(events) {
        const divider = chalk.gray('─'.repeat(62));

        const stats = {
            conflict: events.filter(e => e.eventType === 'attack').length,
            tension: events.filter(e => e.eventType === 'tension').length,
            peace: events.filter(e => e.eventType === 'peace').length,
            neutral: events.filter(e => e.eventType === 'neutral').length,
            total: events.length
        };

        const barLength = 30;
        const createBar = (count, total, color) => {
            if (total === 0) return color('░'.repeat(barLength));
            const filled = Math.round((count / total) * barLength);
            return color('█'.repeat(filled)) + chalk.gray('░'.repeat(barLength - filled));
        };

        return `
${chalk.bold.white('REGIONAL STATISTICS')}
${divider}
${chalk.rgb(255, 60, 60)('Military Conflicts')}     ${stats.conflict.toString().padStart(2)} ${createBar(stats.conflict, stats.total, chalk.rgb(255, 60, 60))}
${chalk.rgb(255, 220, 80)('Political Tensions')}    ${stats.tension.toString().padStart(2)} ${createBar(stats.tension, stats.total, chalk.rgb(255, 220, 80))}
${chalk.rgb(80, 255, 140)('Peace Agreements')}     ${stats.peace.toString().padStart(2)} ${createBar(stats.peace, stats.total, chalk.rgb(80, 255, 140))}
${chalk.rgb(200, 200, 200)('General News')}         ${stats.neutral.toString().padStart(2)} ${createBar(stats.neutral, stats.total, chalk.rgb(200, 200, 200))}
${divider}
${chalk.cyan('Total Events')}          ${chalk.bold.white(stats.total)}
${divider}
        `.trim();
    }
}