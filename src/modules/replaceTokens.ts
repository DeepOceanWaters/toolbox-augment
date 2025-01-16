import { tokens } from '../data/tokens.js';

import type { issueTemplateData, issueTemplate } from '../data/tokens.ts';



const defaultTemplate: issueTemplate = {
    issue: "",
    requirement: "",
    recommendation: "",
    relatedsc: [],
    resources: [],
    arguments: []
}

function descontructTokenString(tokenString: string): [string[], string[]] {
    let splits = tokenString.split(':');
    tokenString = splits[0];
    let args = splits.slice(1);
    let possibleTokens = tokenString.split('.');
    return [possibleTokens, args]
}


export function getRecommendation(token: string): {text: string, template: issueTemplate, name: string} {
    let [possibleTokens, args] = descontructTokenString(token);
    let tokenObj = tokens;
    let outputValue: string = "";
    for (let aToken of possibleTokens) {
        if (aToken in tokens.aliases) {
            aToken = tokens.aliases[aToken];
        }
        if (!(aToken in tokenObj)) {
            alert(`token not found (${token})`);
            return { text: '', template: defaultTemplate, name: 'null'};
        }
        if (aToken === 'resources') {
            let listOfResources = tokenObj["resources"];
            if (!listOfResources) {
                outputValue = `no resources found for ${token}`;
            }
            else {
                for (const resource of listOfResources) {
                    outputValue += "\n" + resource;
                }
            }
        }
        else {
            tokenObj = tokenObj[aToken];
        }
    }
    if (tokenObj["issues"]) {
        outputValue = tokenObj["issues"];
        outputValue += '\n\n';
    }
    if (tokenObj["requirement"]) {
        outputValue += tokenObj["requirement"];
        outputValue += '\n\n';
    }
    if (tokenObj["recommendation"]) {
        outputValue += tokenObj["recommendation"];
    }
    if (tokenObj['resources']) {
        let listOfResources: string[] = tokenObj["resources"];
        if (listOfResources) outputValue += '\n\nResources\n';
        for (const resource of listOfResources) {
            outputValue += "\n" + resource;
        }
    }
    if (typeof tokenObj === 'string') outputValue ||= tokenObj;
    return {
        text: replaceVariables(outputValue, args),
        template: {
            issue: replaceVariables(tokenObj["issues"], args),
            requirement: replaceVariables(tokenObj["requirement"], args),
            recommendation: replaceVariables(tokenObj["recommendation"], args),
            relatedsc: tokenObj["relatedsc"],
            resources: tokenObj["resources"],
            notes: tokenObj["notes"] || "",
            arguments: args
        },
        name: token
    };
}

function replaceVariables(recommendation: string, args: string[]) {
    if (!recommendation) {
        recommendation = "";
    }
    else if (args.length === 1) {
        recommendation = recommendation.replace(/\$var\$/g, args[0]);
    }
    else {
        for (let [index, variable] of args.entries()) {
            let regex = new RegExp(`\$var${index + 1}\$`);
            recommendation = recommendation.replace(regex, variable);
        }
    }
    return recommendation;
}

export function getPossibleTokens() {
    let possibleTokens = [];
    _getTokens(tokens, [], possibleTokens);
    return possibleTokens;
}

function _getTokens(
    tokenObject: issueTemplateData | issueTemplate, 
    curTokenGroup: string[], 
    listOfTokens: string[]
) {
    for (let [key, value] of Object.entries(tokenObject)) {
        // related sc
        if (Array.isArray(value)) continue;
        if (['issues', 'recommendation', 'requirement'].includes(key)) continue;
        let nextTokenString: string[] = structuredClone(curTokenGroup);
        nextTokenString.push(key);
        let currentToken = nextTokenString.join('.');
        if (!listOfTokens.includes(currentToken)
            && (typeof value === 'object' && hasTemplateProperty(value))
        ) {
            listOfTokens.push(nextTokenString.join('.'));
        }
        if (typeof value === 'object') {
            _getTokens(value, nextTokenString, listOfTokens);
        }
    }
}

function hasTemplateProperty(object: object) {
    return object.hasOwnProperty('issues')
        || object.hasOwnProperty('requirement')
        || object.hasOwnProperty('recommendation');
}