import TravelTips from '../../backend/model/travelTips.js';

let answerer;

export const initializeModel = async () => {
    const { pipeline } = await import('@xenova/transformers');
    answerer = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
    console.log('Model initialized successfully');
};

export const answerQuestion = async (req, res) => {

    const { category, locationName } = req.body;

    console.log(category, locationName)
    try {
        const tips = await TravelTips.find({ category, locationName });
        console.log(tips)
        res.json(tips);
    } catch (error) {
        console.error('Error fetching Tips:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

    // try {
    //     const { question } = req.body;
    //     if (!question || !context) {
    //         return res.status(400).json({ error: 'Question and context are required' });
    //     }
    //     if (!answerer) {
    //         return res.status(500).json({ error: 'Model not initialized' });
    //     }
    //     const result = await answerer(question, context);
    //     res.json(result);
    // } catch (error) {
    //     console.error('Error answering question:', error);
    //     res.status(500).json({ error: 'Failed to process the request' });
    // }
};

export const answerQuestionTop = async (req, res) => {

    const { category, locationName, question } = req.body;

    console.log(category, locationName, question)

    console.log("hvoipo", TravelTips)
    try {
        const tips = await TravelTips.find({ category, locationName });
        console.log(tips)
        res.json(tips);
    } catch (error) {
        console.error('Error fetching Tips:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

    // try {
    //     const { question, context } = req.body;
    //     if (!question || !context) {
    //         return res.status(400).json({ error: 'Question and context are required' });
    //     }
    //     if (!answerer) {
    //         return res.status(500).json({ error: 'Model not initialized' });
    //     }
    //     const result = await answerer(question, context, { topk: 3 });
    //     res.json(result);
    // } catch (error) {
    //     console.error('Error answering question:', error);
    //     res.status(500).json({ error: 'Failed to process the request' });
    // }
};
