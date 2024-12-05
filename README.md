# ITIS6177-AzureAITranslator

## API Documentation
[Documentation](https://github.com/jwrig136/ITIS6177-AzureAITranslator/wiki)

## Overview
**API Name**: Azure Text Translation API

**Description**: This API calls Azure Text Translation, a cloud-based REST API feature of the
Translator service that uses neural machine translation technology to enable quick and accurate source-to-
target text translation in real-time across all supported languages.

## API Requests
| Request              | Method | Description                                                                                                                                              |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| [languages](https://github.com/jwrig136/ITIS6177-AzureAITranslator/wiki/API-Guide#url-languages)            | GET    | Returns the set of languages currently supported by the translation, transliteration, and dictionary methods. This request doesn't require authentication headers and you don't need a Translator resource to view the supported language set. |
| [translate](https://github.com/jwrig136/ITIS6177-AzureAITranslator/wiki/API-Guide#url-translate)            | POST   | Translate specified source language text into the target language text.                                                                                                                                                 |
| [detect](https://github.com/jwrig136/ITIS6177-AzureAITranslator/wiki/API-Guide#url-detect)               | POST   | Identify the source language.                                                                                                                                                                                           |
| [dictionary/lookup](https://github.com/jwrig136/ITIS6177-AzureAITranslator/wiki/API-Guide#url-dictionarylookup)    | POST   | Returns alternatives for single word translations.                                                                                                       |
