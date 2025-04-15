import TravelTips from '../model/travelTips.js';
import { pipeline } from '@xenova/transformers';

let answerer;

/**
 * Initialize the question-answering model pipeline.
 */
export const initializeModel = async () => {
    try {
        answerer = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
        console.log('Model initialized successfully');
    } catch (error) {
        console.error('Error initializing model:', error);
        // Handle initialization error as needed
    }
};

/**
 * Answer a question based on category and locationName.
 */
export const answerQuestion = async (req, res) => {
    const { category, locationName } = req.body;

    try {
        const tips = await TravelTips.find({ category, locationName });

        if (!tips || tips.length === 0) {
            return res.status(404).json({ error: 'No tips found for the specified category and location' });
        }

        const mergedData = mergeDataEntries(tips);
        const paragraph = generateParagraph(mergedData);

        const { question } = req.body;

        if (!question || !paragraph) {
            return res.status(400).json({ error: 'Question and paragraph are required' });
        }

        if (!answerer) {
            return res.status(500).json({ error: 'Model not initialized' });
        }

        const result = await answerer(question, paragraph);
        res.json(result);
    } catch (error) {
        console.error('Error answering question:', error);
        res.status(500).json({ error: 'Failed to process the request' });
    }
};

/**
 * Merge multiple data entries for the same category and location.
 */
const mergeDataEntries = (entries) => {
    const mergedData = {
        category: entries[0].category,
        locationName: entries[0].locationName,
        typeOfWear: getUniqueValues(entries.map(entry => entry.typeOfWear)),
        necessaryItems: getUniqueValues(entries.map(entry => entry.necessaryItems)),
        nativeLanguage: getUniqueValues(entries.map(entry => entry.nativeLanguage)),
        localCuisine: getUniqueValues(entries.map(entry => entry.localCuisine)),
        nearestCommute: getUniqueValues(entries.map(entry => entry.nearestCommute)),
        travelChallenges: getUniqueValues(entries.map(entry => entry.travelChallenges)),
        solutions: getUniqueValues(entries.map(entry => entry.solutions)),
        culturalInsights: getUniqueValues(entries.map(entry => entry.culturalInsights))
    };

    return mergedData;
};

/**
 * Utility function to get unique values from an array.
 */
const getUniqueValues = (arr) => Array.from(new Set(arr));

/**
 * Utility function to get a random element from an array.
 */
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generate a paragraph based on merged data.
 */
const generateParagraph = (data) => {
    const timeToVisit = getRandomElement([
        "The best time to visit is during spring and autumn.",
        "Spring and fall are the ideal seasons to visit.",
        "You should plan your visit for spring or autumn."
    ]);

    const clothingAdvice = getRandomElement([
        `Wear ${getRandomElement(data.typeOfWear)} and be sure to bring ${getRandomElement(data.necessaryItems)}.`,
        `It's advisable to wear ${getRandomElement(data.typeOfWear)} and carry ${getRandomElement(data.necessaryItems)}.`,
        `You should wear ${getRandomElement(data.typeOfWear)} and take along ${getRandomElement(data.necessaryItems)}.`
    ]);

    const cuisineAndLanguage = getRandomElement([
        `The local language is ${getRandomElement(data.nativeLanguage)}, and you must try the local food like ${getRandomElement(data.localCuisine)}.`,
        `People speak ${getRandomElement(data.nativeLanguage)} here, and you can enjoy meals such as ${getRandomElement(data.localCuisine)}.`,
        `The common language is ${getRandomElement(data.nativeLanguage)}, and local dishes include ${getRandomElement(data.localCuisine)}.`
    ]);

    const commuteOptions = getRandomElement([
        `You can get around using ${getRandomElement(data.nearestCommute)}.`,
        `${getRandomElement(data.nearestCommute)} are convenient for travel.`,
        `For transportation, use ${getRandomElement(data.nearestCommute)}.`
    ]);

    const challengesAndSolutions = getRandomElement([
        `Some challenges you might face include ${getRandomElement(data.travelChallenges)}, but ${getRandomElement(data.solutions)} can help.`,
        `While visiting, you might encounter ${getRandomElement(data.travelChallenges)}, but ${getRandomElement(data.solutions)} will be useful.`,
        `Visitors often face ${getRandomElement(data.travelChallenges)}, though ${getRandomElement(data.solutions)} can alleviate these issues.`
    ]);

    const culturalAdvice = getRandomElement([
        `Remember to ${getRandomElement(data.culturalInsights)}.`,
        `It's important to ${getRandomElement(data.culturalInsights)}.`,
        `Be mindful to ${getRandomElement(data.culturalInsights)}.`
    ]);

    return `Visiting ${data.locationName} is a wonderful experience. ${timeToVisit} ${clothingAdvice} ${cuisineAndLanguage} ${commuteOptions} ${challengesAndSolutions} ${culturalAdvice}`;
};

/**
 * Answer a top question based on category, locationName, and question.
 */
export const answerQuestionTop = async (req, res) => {
    const { category, locationName, question } = req.body;

    try {
        const tips = await TravelTips.find({ category, locationName });

        if (!tips || tips.length === 0) {
            return res.status(404).json({ error: 'No tips found for the specified category and location' });
        }

        const mergedData = mergeDataEntries(tips);
        const paragraph = generateParagraph(mergedData);

        if (!question || !paragraph) {
            return res.status(400).json({ error: 'Question and paragraph are required' });
        }

        if (!answerer) {
            return res.status(500).json({ error: 'Model not initialized' });
        }

        const result = await answerer(question, paragraph, { topk: 3 });
        res.json(result);
    } catch (error) {
        console.error('Error answering top question:', error);
        res.status(500).json({ error: 'Failed to process the request' });
    }
};
