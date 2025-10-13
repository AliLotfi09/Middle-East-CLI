// news-analyzer.js - Enhanced with Beautiful Console Output
import Parser from 'rss-parser';

const ansi = {
    cyan: s => `\x1b[36m${s}\x1b[0m`,
    gray: s => `\x1b[90m${s}\x1b[0m`,
    green: s => `\x1b[32m${s}\x1b[0m`,
    red: s => `\x1b[31m${s}\x1b[0m`,
    yellow: s => `\x1b[33m${s}\x1b[0m`,
    blue: s => `\x1b[34m${s}\x1b[0m`,
    magenta: s => `\x1b[35m${s}\x1b[0m`,
    white: s => `\x1b[37m${s}\x1b[0m`,
    bold: s => `\x1b[1m${s}\x1b[0m`,
    dim: s => `\x1b[2m${s}\x1b[0m`
};

export class NewsAnalyzer {
    constructor(options = {}) {
        this.parser = new Parser({
            timeout: 10000,
            customFields: { item: ['content:encoded', 'description'] }
        });

        this.feeds = options.feeds || [
            'https://www.aljazeera.com/xml/rss/all.xml',
            'https://www.middleeastmonitor.com/feed/'
        ];

        this.geoEntities = {
            'syria': {
                canonical: 'syria',
                aliases: ['syrian', 'syrians'],
                cities: ['damascus', 'aleppo', 'homs', 'idlib', 'latakia', 'raqqa'],
                demonyms: ['syrian'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8 }
            },
            'iraq': {
                canonical: 'iraq',
                aliases: ['iraqi', 'iraqis'],
                cities: ['baghdad', 'mosul', 'basra', 'erbil', 'kirkuk', 'najaf'],
                demonyms: ['iraqi'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8 }
            },
            'iran': {
                canonical: 'iran',
                aliases: ['iranian', 'iranians', 'persia', 'persian'],
                cities: ['tehran', 'isfahan', 'shiraz', 'tabriz', 'mashhad', 'qom'],
                demonyms: ['iranian', 'persian'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8 }
            },
            'lebanon': {
                canonical: 'lebanon',
                aliases: ['lebanese'],
                cities: ['beirut', 'tripoli', 'sidon', 'tyre', 'zahle'],
                demonyms: ['lebanese'],
                organizations: ['hezbollah', 'hizballah'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8, org: 7 }
            },
            'jordan': {
                canonical: 'jordan',
                aliases: ['jordanian', 'jordanians'],
                cities: ['amman', 'zarqa', 'irbid', 'aqaba'],
                demonyms: ['jordanian'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8 }
            },
            'saudi arabia': {
                canonical: 'saudi arabia',
                aliases: ['saudi', 'saudis', 'ksa', 'kingdom of saudi arabia'],
                cities: ['riyadh', 'jeddah', 'mecca', 'medina', 'dammam', 'tabuk'],
                demonyms: ['saudi'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8 }
            },
            'yemen': {
                canonical: 'yemen',
                aliases: ['yemeni', 'yemenis'],
                cities: ['sanaa', 'aden', 'taiz', 'hodeidah', 'mukalla'],
                organizations: ['houthi', 'houthis', 'ansar allah'],
                demonyms: ['yemeni'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8, org: 9 }
            },
            'uae': {
                canonical: 'united arab emirates',
                aliases: ['uae', 'emirates', 'emirati', 'emiratis'],
                cities: ['dubai', 'abu dhabi', 'sharjah', 'ajman', 'fujairah'],
                demonyms: ['emirati'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8 }
            },
            'palestine': {
                canonical: 'palestine',
                aliases: ['palestinian', 'palestinians'],
                cities: ['gaza', 'rafah', 'khan yunis', 'ramallah', 'nablus', 'hebron', 'jenin'],
                organizations: ['hamas', 'fatah', 'plo', 'islamic jihad'],
                regions: ['west bank', 'gaza strip'],
                demonyms: ['palestinian'],
                weight: { canonical: 15, alias: 10, city: 8, demonym: 10, org: 7, region: 12 }
            },
            'israel': {
                canonical: 'israel',
                aliases: ['israeli', 'israelis'],
                cities: ['tel aviv', 'jerusalem', 'haifa', 'beersheba', 'netanya'],
                organizations: ['idf', 'mossad', 'shin bet'],
                demonyms: ['israeli'],
                politicians: ['netanyahu', 'gantz', 'lapid'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 10, org: 8, politician: 5 }
            },
            'egypt': {
                canonical: 'egypt',
                aliases: ['egyptian', 'egyptians'],
                cities: ['cairo', 'alexandria', 'giza', 'luxor', 'aswan', 'suez'],
                demonyms: ['egyptian'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8 }
            },
            'turkey': {
                canonical: 'turkey',
                aliases: ['turkish', 'turkiye', 'türkiye'],
                cities: ['ankara', 'istanbul', 'izmir', 'antalya', 'bursa'],
                politicians: ['erdogan', 'erdoğan'],
                demonyms: ['turkish'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8, politician: 5 }
            },
            'afghanistan': {
                canonical: 'afghanistan',
                aliases: ['afghan', 'afghans'],
                cities: ['kabul', 'kandahar', 'herat', 'mazar-i-sharif', 'jalalabad'],
                organizations: ['taliban'],
                demonyms: ['afghan'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8, org: 12 }
            },
            'pakistan': {
                canonical: 'pakistan',
                aliases: ['pakistani', 'pakistanis'],
                cities: ['islamabad', 'karachi', 'lahore', 'peshawar', 'quetta', 'rawalpindi'],
                demonyms: ['pakistani'],
                weight: { canonical: 15, alias: 10, city: 6, demonym: 8 }
            }
        };

        this.eventClassifiers = {
            attack: {
                tier1: {
                    patterns: [
                        'killed', 'death', 'deaths', 'dead', 'died', 'dying', 'fatalities',
                        'massacre', 'slaughter', 'assassinated', 'murdered', 'executed',
                        'casualties', 'victims', 'body', 'bodies', 'corpse'
                    ],
                    weight: 20
                },
                tier2: {
                    patterns: [
                        'explosion', 'exploded', 'blast', 'bomb', 'bombing', 'bombed',
                        'airstrike', 'air strike', 'missile', 'rocket attack',
                        'drone strike', 'suicide bomb', 'car bomb', 'ied',
                        'shelling', 'artillery', 'bombardment', 'gunfire'
                    ],
                    weight: 15
                },
                tier3: {
                    patterns: [
                        'attack', 'attacked', 'attacking', 'attacks',
                        'strike', 'struck', 'strikes', 'striking',
                        'raid', 'raided', 'offensive', 'assault', 'ambush',
                        'wounded', 'injured', 'hurt', 'shot', 'shooting'
                    ],
                    weight: 8
                },
                tier4: {
                    patterns: [
                        'violence', 'violent', 'clash', 'clashes', 'fighting',
                        'battle', 'combat', 'war', 'warfare', 'conflict',
                        'military operation', 'invasion', 'occupation'
                    ],
                    weight: 4
                },
                negatives: [
                    'avoid', 'prevent', 'stop', 'end', 'halt',
                    'condemn', 'denounce', 'oppose', 'against',
                    'fear of', 'threat of', 'risk of', 'potential'
                ],
                negativeWeight: -5
            },

            peace: {
                tier1: {
                    patterns: [
                        'ceasefire', 'cease-fire', 'cease fire',
                        'peace treaty', 'peace agreement', 'peace accord', 'peace pact',
                        'armistice', 'truce'
                    ],
                    weight: 25
                },
                tier2: {
                    patterns: [
                        'peace deal', 'peace process', 'peace initiative',
                        'normalization agreement', 'normalization deal',
                        'reconciliation agreement', 'diplomatic breakthrough',
                        'end of war', 'end of hostilities', 'war ended'
                    ],
                    weight: 15
                },
                tier3: {
                    patterns: [
                        'peace talks', 'peace negotiations', 'peace conference',
                        'diplomatic talks', 'dialogue', 'mediation',
                        'settlement', 'agreement reached', 'deal signed'
                    ],
                    weight: 6
                },
                negatives: [
                    'calls for', 'urged', 'urged for', 'demand', 'demanded',
                    'need', 'must', 'should', 'calling for', 'call for',
                    'violated', 'violation', 'break', 'broken', 'rejected',
                    'refuse', 'refused', 'denial', 'no ceasefire', 'without',
                    'after ceasefire', 'before ceasefire', 'following ceasefire',
                    'monitor', 'monitoring', 'implementation', 'implement'
                ],
                negativeWeight: -30
            },

            tension: {
                tier1: {
                    patterns: [
                        'sanctions', 'sanctioned', 'embargo', 'blockade',
                        'expelled diplomats', 'recalled ambassador',
                        'diplomatic crisis', 'severed ties', 'cut ties'
                    ],
                    weight: 15
                },
                tier2: {
                    patterns: [
                        'protest', 'protests', 'demonstration', 'demonstrations',
                        'unrest', 'riots', 'uprising', 'revolt'
                    ],
                    weight: 10
                },
                tier3: {
                    patterns: [
                        'escalation', 'tension', 'tensions', 'standoff',
                        'dispute', 'crisis', 'confrontation', 'deadlock',
                        'threat', 'threatened', 'warning', 'ultimatum'
                    ],
                    weight: 6
                },
                tier4: {
                    patterns: [
                        'condemned', 'denounced', 'criticism', 'criticized',
                        'accused', 'blamed', 'dispute', 'disagreement'
                    ],
                    weight: 3
                }
            }
        };

        this.contextModifiers = {
            temporal: {
                past: ['was', 'were', 'had', 'ended', 'concluded', 'finished', 'previous', 'former', 'last year'],
                future: ['will', 'would', 'plan', 'planning', 'intend', 'expect', 'may', 'might', 'could'],
                conditional: ['if', 'unless', 'should', 'in case', 'provided that']
            },
            modal: {
                uncertainty: ['may', 'might', 'could', 'possibly', 'perhaps', 'allegedly', 'reportedly'],
                negation: ['not', 'no', 'never', 'neither', 'nor', 'without', 'refuse', 'reject']
            }
        };
    }

    async analyzeFeeds() {
        const events = [];

        const divider = ansi.gray('─'.repeat(62));
        console.log('');
        console.log(ansi.cyan(ansi.bold('NLP NEWS ANALYSIS ENGINE')));
        console.log(divider);
        console.log('');

        for (const feedUrl of this.feeds) {
            try {
                const feedName = this.shortenUrl(feedUrl);
                process.stdout.write(ansi.dim(`   Fetching ${feedName}...`));

                const feed = await this.parser.parseURL(feedUrl);

                let feedEvents = 0;
                (feed.items || []).slice(0, 30).forEach(item => {
                    const event = this.analyzeItem(item);
                    if (event) {
                        events.push(event);
                        feedEvents++;
                    }
                });

                process.stdout.write(`\r   ${ansi.green('✓')} ${ansi.white(feedName)} ${ansi.gray('─')} ${ansi.cyan(feedEvents)} events\n`);
            } catch (error) {
                process.stdout.write(`\r   ${ansi.red('✗')} ${ansi.gray(this.shortenUrl(feedUrl))} ${ansi.red('─')} ${ansi.dim(error.message)}\n`);
            }
        }

        console.log('');
        console.log(divider);
        console.log(ansi.green(`   Total Events Identified: ${ansi.bold(events.length.toString())}`));
        console.log(divider);
        console.log('');

        return this.consolidateEvents(events);
    }

    analyzeItem(item) {
        if (!item || !item.title) return null;

        const titleRaw = item.title.trim();
        const contentRaw = (item.contentSnippet || item.content || item.description || '').trim();

        const title = this.normalize(titleRaw);
        const content = this.normalize(contentRaw);

        const analysisText = `${title} ${title} ${title} ${content}`;

        const country = this.detectCountryAdvanced(analysisText, title);
        if (!country) return null;

        const { eventType, confidence, scores } = this.classifyEventAdvanced(analysisText, title, titleRaw);

        const typeIcon = {
            'attack': ansi.red('◉'),
            'tension': ansi.yellow('●'),
            'peace': ansi.green('◆'),
            'neutral': ansi.gray('•')
        }[eventType] || ansi.gray('•');

        console.log(ansi.dim(`   ${typeIcon} ${ansi.white(country.toUpperCase().padEnd(12))} ${ansi.dim('│')} ${this.shortenText(titleRaw, 40)}`));

        return {
            country,
            eventType,
            confidence,
            title: titleRaw,
            date: new Date(item.pubDate || Date.now()),
            source: item.link || '',
            scores
        };
    }

    normalize(text = '') {
        return String(text)
            .replace(/\u00A0/g, ' ')
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[^\w\s\-']/g, ' ')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .trim();
    }

    detectCountryAdvanced(text, title) {
        const candidates = [];

        for (const [country, config] of Object.entries(this.geoEntities)) {
            let score = 0;
            const matches = { canonical: 0, alias: 0, city: 0, org: 0, region: 0 };

            const canonicalRegex = new RegExp(`\\b${this.escapeRegex(config.canonical)}\\b`, 'gi');
            matches.canonical = (text.match(canonicalRegex) || []).length;
            score += matches.canonical * config.weight.canonical;

            if (title.match(canonicalRegex)) {
                score += config.weight.canonical * 3;
            }

            for (const alias of config.aliases || []) {
                const aliasRegex = new RegExp(`\\b${this.escapeRegex(alias)}\\b`, 'gi');
                const aliasMatches = (text.match(aliasRegex) || []).length;
                matches.alias += aliasMatches;
                score += aliasMatches * config.weight.alias;

                if (title.match(aliasRegex)) {
                    score += config.weight.alias * 2;
                }
            }

            for (const city of config.cities || []) {
                const cityRegex = new RegExp(`\\b${this.escapeRegex(city)}\\b`, 'gi');
                const cityMatches = (text.match(cityRegex) || []).length;
                matches.city += cityMatches;
                score += cityMatches * config.weight.city;

                if (title.match(cityRegex)) {
                    score += config.weight.city * 2;
                }
            }

            for (const org of config.organizations || []) {
                const orgRegex = new RegExp(`\\b${this.escapeRegex(org)}\\b`, 'gi');
                const orgMatches = (text.match(orgRegex) || []).length;
                matches.org += orgMatches;
                score += orgMatches * config.weight.org;
            }

            for (const region of config.regions || []) {
                const regionRegex = new RegExp(`\\b${this.escapeRegex(region)}\\b`, 'gi');
                const regionMatches = (text.match(regionRegex) || []).length;
                matches.region += regionMatches;
                score += regionMatches * config.weight.region;
            }

            if (score >= 8) {
                candidates.push({ country, score, matches });
            }
        }

        candidates.sort((a, b) => b.score - a.score);
        return candidates.length > 0 ? candidates[0].country : null;
    }

    classifyEventAdvanced(text, title, originalTitle) {
        const scores = {
            attack: 0,
            peace: 0,
            tension: 0
        };

        for (const [eventType, classifier] of Object.entries(this.eventClassifiers)) {
            for (const [tier, config] of Object.entries(classifier)) {
                if (tier === 'negatives' || tier === 'negativeWeight') continue;

                for (const pattern of config.patterns) {
                    const regex = new RegExp(`\\b${this.escapeRegex(pattern)}\\b`, 'gi');

                    const textMatches = (text.match(regex) || []).length;
                    scores[eventType] += textMatches * config.weight;

                    const titleMatches = (title.match(regex) || []).length;
                    scores[eventType] += titleMatches * config.weight * 2;
                }
            }

            for (const negPattern of classifier.negatives || []) {
                const negRegex = new RegExp(`\\b${this.escapeRegex(negPattern)}\\b`, 'gi');
                const negMatches = (originalTitle.toLowerCase().match(negRegex) || []).length +
                    (text.match(negRegex) || []).length;

                if (negMatches > 0) {
                    scores[eventType] += negMatches * classifier.negativeWeight;
                }
            }
        }

        scores.attack = Math.max(0, scores.attack);
        scores.peace = Math.max(0, scores.peace);
        scores.tension = Math.max(0, scores.tension);

        const hasUncertainty = this.contextModifiers.modal.uncertainty.some(word =>
            text.includes(word)
        );

        if (hasUncertainty) {
            scores.attack *= 0.7;
            scores.peace *= 0.6;
            scores.tension *= 0.8;
        }

        let eventType = 'neutral';
        let confidence = 0;

        const maxScore = Math.max(scores.attack, scores.peace, scores.tension);

        if (maxScore < 5) {
            return { eventType: 'neutral', confidence: 0, scores };
        }

        if (scores.attack >= 20) {
            eventType = 'attack';
            confidence = Math.min(95, Math.round((scores.attack / (scores.attack + scores.peace + scores.tension)) * 100));
        }
        else if (scores.attack >= 10 && scores.attack > scores.peace * 2) {
            eventType = 'attack';
            confidence = Math.min(85, Math.round((scores.attack / maxScore) * 100));
        }
        else if (scores.peace >= 25 && scores.attack < 10) {
            eventType = 'peace';
            confidence = Math.min(90, Math.round((scores.peace / maxScore) * 100));
        }
        else if (scores.peace >= 15 && scores.attack < 5 && scores.peace > scores.tension * 2) {
            eventType = 'peace';
            confidence = Math.min(75, Math.round((scores.peace / maxScore) * 100));
        }
        else if (scores.tension >= 15 && scores.attack < 8) {
            eventType = 'tension';
            confidence = Math.min(80, Math.round((scores.tension / maxScore) * 100));
        }
        else if (scores.tension >= 8 && scores.attack < 5 && scores.tension > scores.peace) {
            eventType = 'tension';
            confidence = Math.min(70, Math.round((scores.tension / maxScore) * 100));
        }
        else if (maxScore >= 8) {
            eventType = scores.attack >= maxScore ? 'attack' :
                scores.peace >= maxScore ? 'peace' : 'tension';
            confidence = Math.round((maxScore / (scores.attack + scores.peace + scores.tension)) * 100);
        }

        return { eventType, confidence, scores };
    }

    consolidateEvents(events) {
        const map = {};
        const priorities = { 'attack': 4, 'tension': 3, 'peace': 2, 'neutral': 1 };

        events.forEach(ev => {
            const k = ev.country;
            if (!map[k]) {
                map[k] = ev;
            } else {
                const cur = map[k];
                const pNew = priorities[ev.eventType] || 0;
                const pCur = priorities[cur.eventType] || 0;

                if (pNew > pCur) {
                    map[k] = ev;
                }
                else if (pNew === pCur) {
                    if (ev.confidence > cur.confidence) {
                        map[k] = ev;
                    }
                    else if (ev.confidence === cur.confidence && new Date(ev.date) > new Date(cur.date)) {
                        map[k] = ev;
                    }
                }
            }
        });

        return Object.values(map).sort((a, b) =>
            (priorities[b.eventType] - priorities[a.eventType]) ||
            (b.confidence - a.confidence) ||
            (new Date(b.date) - new Date(a.date))
        );
    }

    shortenUrl(url) {
        try {
            const u = new URL(url);
            return u.hostname.replace('www.', '');
        } catch {
            return url.slice(0, 30) + '...';
        }
    }

    shortenText(text, length) {
        return text.length > length ? text.slice(0, length) + '...' : text;
    }

    escapeRegex(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\  escapeReg');
    }
}