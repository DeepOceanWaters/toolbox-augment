import { tokens } from '../data/tokens.js';

export function main() {
    if ('pleaseListTokens' in window) {
        listTokens();
    }
    else {
        addRecommendation();
    }
}

function descontructTokenString(tokenString) {
    let splits = tokenString.split(':');
    tokenString = splits[0];
    let args = splits.slice(1);
    let possibleTokens = tokenString.split('.');
    return [possibleTokens, args]
}

export function getRecommendation(token) {
    let [possibleTokens, args] = descontructTokenString(token);
    let tokenObj = tokens;
    let outputValue = "";
    for (let aToken of possibleTokens) {
        if (aToken in tokens.aliases) {
            aToken = tokens.aliases[aToken];
        }
        if (!(aToken in tokenObj)) {
            alert(`token not found (${token})`);
            return;
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
        let listOfResources = tokenObj["resources"];
        if (listOfResources) outputValue += '\n\nResources\n';
        for (const resource of listOfResources) {
            outputValue += "\n" + resource;
        }
    }
    outputValue ||= typeof tokenObj === 'string' ? tokenObj : tokenObj.value;
    return {
        text: replaceVariables(outputValue, args),
        template: {
            issue: replaceVariables(tokenObj["issues"], args),
            requirement: replaceVariables(tokenObj["requirement"], args),
            recommendation: replaceVariables(tokenObj["recommendation"], args),
            relatedsc: tokenObj["relatedsc"],
            resources: tokenObj["resources"],
            arguments: args
        }
    };
}

function replaceVariables(recommendation, args) {
    if (args.length === 1) {
        recommendation = recommendation.replaceAll('$var$', args[0]);
    }
    else {
        let variablesAndValues = getVariablesAndValues(args);
        for (let [variable, value] of variablesAndValues) {
            recommendation = recommendation.replaceAll(`$${variable}$`, value);
        }
    }
    return recommendation;
}

function getVariablesAndValues(variableAssignments) {
    let variablesAndValues = [];
    for (let variableAssignment of variableAssignments) {
        let [variable, value] = variableAssignment.split('=');
        variablesAndValues.push([variable, value]);
    }
    return variablesAndValues;
}

function getTokenMatches(text) {
    let tokenRegex = /~~(.+?)(\n|;|$)/gi;
    return [...text.matchAll(tokenRegex)].map(x => [x[0], x[1]]);
}

/**
 * Note that due to how the toolbox's widget works, only the text nodes should be replaced.
 * @param {HTMLNode} node 
 */
function replaceAllTokens(node) {
    for (let child of node.childNodes) {
        // type of 3 === text node
        if (child.nodeType === 3) {
            let text = child.nodeValue;
            let tokenMatches = getTokenMatches(text);
            // for each token replace with recommendation
            node.textContent = '';
            let processedText = text;
            for (let [originalText, token] of tokenMatches) {
                let withValue = token === 'helpvalue';
                if (token === 'help' || withValue) {
                    let allOptions = listTokens(withValue);
                    let optionsText = '';
                    for (const option of allOptions) {
                        optionsText += option + '\n';
                    }
                    processedText = processedText.replaceAll('help', optionsText);
                    console.log(allOptions);
                }
                else {
                    let recommendation = getRecommendation(token) || `(couldn't find ${token})`;
                    processedText = processedText.replace(processedText, recommendation);
                }
            }
            node.append(processedText);
        }
        else {
            replaceAllTokens(child);
        }
    }
}

function addRecommendation() {
    let recommendationEditor = document.querySelector('#editor2 > .ql-editor');
    return replaceAllTokens(recommendationEditor);
}

function listTokens(withValue = false) {
    let tokenList = [];
    let tokenNames = Object.keys(tokens).sort();
    for (let token of tokenNames) {
        let tokenObj = tokens[token];
        let tokenObjKeys = Object.keys(tokenObj);
        tokenObjKeys.splice(tokenObjKeys.indexOf('value'), 1);
        let options = tokenObjKeys.join(', ');
        let text = `${token}[ ${options} ]`;
        if (withValue) text += `: ${tokens[token].value.substring(0, 25)}...`;
        tokenList.push(text);
    }
    console.log(tokenList);
    return tokenList;
}

export function getPossibleTokens() {
    let possibleTokens = [];
    _getTokens(tokens, [], possibleTokens);
    return possibleTokens;
}

function _getTokens(tokenObject, curTokenString, listOfTokens) {
    for (let [key, value] of Object.entries(tokenObject)) {
        // related sc
        if (Array.isArray(value)) continue;
        if (['issues', 'recommendation', 'requirement'].includes(key)) continue;
        let nextTokenString = structuredClone(curTokenString);
        nextTokenString.push(key);
        let currentToken = nextTokenString.join('.');
        if (!listOfTokens.includes(currentToken)
            &&
            (typeof value === 'object' && hasTemplateProperty(value))
        ) {
            listOfTokens.push(nextTokenString.join('.'));
        }
        if (typeof value === 'object') {
            _getTokens(value, nextTokenString, listOfTokens);
        }
    }
}

function hasTemplateProperty(object) {
    return object.hasOwnProperty('issues')
        || object.hasOwnProperty('requirement')
        || object.hasOwnProperty('recommendation');
}