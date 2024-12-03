const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;
const axios = require('axios').default;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { v4: uuidv4 } = require('uuid');
const { body, query, validationResult } = require("express-validator");

app.use(express.json());

let key = process.env.API_KEY;
let endpoint = "https://api.cognitive.microsofttranslator.com";
let location = "eastus";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Azure AI Translator API",
            version: "1.0.0",
            description: "Personal API used to read Azure AI Translator API",
        },
        host: "http://68.183.139.171:3000",
        basePath: "/",
    },
    apis: ["./index.js"],
};

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

/**
 * @swagger
 * /languages:
 *   get:
 *     tags:
 *       - Language
 *     summary: List all languages the API supports
 *     produces:
 *       -application/json
 *     responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Error in listing languages`
 */

app.get('/languages', async (req, res) => {
    try {
        axios({
            baseURL: endpoint,
            url: '/languages?api-version=3.0',
            method: 'get',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                // location required if you're using a multi-service or regional (not global) resource.
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'scope': 'translation'
            },
            responseType: 'json'
        }).then(function (response) {
            res.status(200).json(response.data, null, 4);
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /translate:
 *  post:
 *    tags:
 *      - Translation
 *    summary: Translate text from one language to another
 *    parameters:
 *      - in: query
 *        name: fromLanguage
 *        required: false
 *        description: The language the text is in
 *        schema:
 *        type: string
 *      - in: query
 *        name: toLanguage
 *        required: true
 *        description: The language to translate the text to
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *    responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Erorr
 */

app.post('/translate', [
    query('fromLanguage').optional(),
    query('toLanguage').notEmpty().withMessage("Please provide a language to translate to"),
    body("text").notEmpty().withMessage("Please provide a text to translate")
], async (req, res) => {

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({ errs: errs.array() });
    }

    const fromLang = req.query.fromLanguage;
    const toLang = req.query.toLanguage;
    const text = req.body.text;

    try {
        axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                // location required if you're using a multi-service or regional (not global) resource.
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'from': fromLang,
                'to': toLang
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        }).then(function (response) {
            res.status(200).json(response.data, null, 4);
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /detect:
 *  post:
*    tags:
 *      - Language
 *    summary: Detect the language of a text
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *    responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Erorr
 */

app.post('/detect', [
    body("text").notEmpty().withMessage("Please provide a text")
], async (req, res) => {

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({ errs: errs.array() });
    }

    const text = req.body.text;

    try {
        axios({
            baseURL: endpoint,
            url: '/detect',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                // location required if you're using a multi-service or regional (not global) resource.
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0'
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        }).then(function (response) {
            res.status(200).json(response.data, null, 4);
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

/**
 * @swagger
 * /dictionary/lookup:
 *  post:
 *    tags:
 *      - Dictionary
 *    summary: Lookup alternate words for word provided
 *    parameters:
 *      - in: query
 *        name: fromLanguage
 *        required: true
 *        description: The language the word is in
 *        schema:
 *        type: string
 *      - in: query
 *        name: toLanguage
 *        required: true
 *        description: The language to translate the word to
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *    responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Erorr
 */

app.post('/dictionary/lookup', [
    query('fromLanguage').notEmpty().withMessage("Please provide the language the word is in"),
    query('toLanguage').notEmpty().withMessage("Please provide a language to translate to"),
    body("text").notEmpty().withMessage("Please provide a word to translate")
], async (req, res) => {

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
        return res.status(400).json({ errs: errs.array() });
    }

    const fromLang = req.query.fromLanguage;
    const toLang = req.query.toLanguage;
    const text = req.body.text;

    try {
        axios({
            baseURL: endpoint,
            url: '/dictionary/lookup',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                // location required if you're using a multi-service or regional (not global) resource.
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'from': fromLang,
                'to': toLang
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        }).then(function (response) {
            res.status(200).json(response.data, null, 4);
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

app.listen(port, () => {
    console.log(`Example app listening at http//localhost:${port}`);
});
