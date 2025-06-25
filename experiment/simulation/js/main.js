//Your JavaScript goes in here

// Utility to fetch and parse the data file
function fetchDataFile(language) {
    const fileMap = {
        'eng': 'analyse-size-chunk/accuracies_english',
        'hin': 'analyse-size-chunk/accuracies_hindi'
    };
    return fetch(fileMap[language])
        .then(response => response.text())
        .then(text => {
            // Parse the file into an array of objects
            const lines = text.trim().split('\n');
            return lines.map(line => {
                const tokens = line.split('\t');
                return {
                    train_token: tokens[0],
                    train_type: tokens[1],
                    algo: tokens[2],
                    feature: tokens[3],
                    test_token: tokens[4],
                    test_type: tokens[5],
                    accuracy: tokens[6]
                };
            });
        });
}

// Helper: Explanations and tooltips
const EXPLANATIONS = {
    language: 'Language affects the data and model performance.',
    train: 'Larger corpora usually lead to better model accuracy.',
    algo: 'For algorithm for training the chunker, CRF (Conditional Random Fields) and HMM (Hidden Markov Model) are common sequence models.',
    feature: 'Features to use for training influence what information the model uses to make predictions.'
};

const TOOLTIP = {
    lang: {
        eng: 'English language corpus',
        hin: 'Hindi language corpus'
    },
    train: {
        '1k': '1,000 sentences in the training set',
        '10k': '10,000 sentences in the training set',
        '100k': '100,000 sentences in the training set',
        '200k': '200,000 sentences in the training set'
    },
    algo: {
        'CRF': 'Conditional Random Fields: a statistical modeling method often used for structured prediction.',
        'HMM': 'Hidden Markov Model: a generative probabilistic model for sequence data.'
    },
    feature: {
        'only_lexicon': 'Use only lexical (word) features.',
        'only_pos': 'Use only part-of-speech features.',
        'lexicon_and_pos': 'Use both lexical and part-of-speech features.'
    }
};

// Example sentences and chunked outputs for demonstration
const EXAMPLES = {
    eng: {
        CRF: {
            only_lexicon: [
                {sentence: 'The cat sat on the mat.', chunks: '[NP The cat] [VP sat] [PP on] [NP the mat] .'},
                {sentence: 'She enjoys playing tennis.', chunks: '[NP She] [VP enjoys] [VP playing] [NP tennis] .'}
            ],
            only_pos: [
                {sentence: 'John saw the dog.', chunks: '[NP John] [VP saw] [NP the dog] .'},
                {sentence: 'Birds fly high.', chunks: '[NP Birds] [VP fly] [ADVP high] .'}
            ],
            lexicon_and_pos: [
                {sentence: 'The quick brown fox jumps.', chunks: '[NP The quick brown fox] [VP jumps] .'},
                {sentence: 'He reads books.', chunks: '[NP He] [VP reads] [NP books] .'}
            ]
        },
        HMM: {
            only_lexicon: [
                {sentence: 'Dogs bark loudly.', chunks: '[NP Dogs] [VP bark] [ADVP loudly] .'},
                {sentence: 'The sun rises.', chunks: '[NP The sun] [VP rises] .'}
            ],
            only_pos: [
                {sentence: 'Children play outside.', chunks: '[NP Children] [VP play] [ADVP outside] .'},
                {sentence: 'The birds sing.', chunks: '[NP The birds] [VP sing] .'}
            ],
            lexicon_and_pos: [
                {sentence: 'Alice reads a book.', chunks: '[NP Alice] [VP reads] [NP a book] .'},
                {sentence: 'The dog chased the cat.', chunks: '[NP The dog] [VP chased] [NP the cat] .'}
            ]
        }
    },
    hin: {
        CRF: {
            only_lexicon: [
                {sentence: 'राम स्कूल जाता है।', chunks: '[NP राम] [NP स्कूल] [VP जाता है] ।'},
                {sentence: 'सीता किताब पढ़ती है।', chunks: '[NP सीता] [NP किताब] [VP पढ़ती है] ।'}
            ],
            only_pos: [
                {sentence: 'बच्चे खेल रहे हैं।', chunks: '[NP बच्चे] [VP खेल रहे हैं] ।'},
                {sentence: 'गाय घास खाती है।', chunks: '[NP गाय] [NP घास] [VP खाती है] ।'}
            ],
            lexicon_and_pos: [
                {sentence: 'मैं बाजार जा रहा हूँ।', chunks: '[NP मैं] [NP बाजार] [VP जा रहा हूँ] ।'},
                {sentence: 'वह खाना बना रही है।', chunks: '[NP वह] [NP खाना] [VP बना रही है] ।'}
            ]
        },
        HMM: {
            only_lexicon: [
                {sentence: 'लड़के दौड़ते हैं।', chunks: '[NP लड़के] [VP दौड़ते हैं] ।'},
                {sentence: 'पेड़ हरे हैं।', chunks: '[NP पेड़] [ADJP हरे हैं] ।'}
            ],
            only_pos: [
                {sentence: 'बिल्ली दूध पीती है।', chunks: '[NP बिल्ली] [NP दूध] [VP पीती है] ।'},
                {sentence: 'पक्षी उड़ते हैं।', chunks: '[NP पक्षी] [VP उड़ते हैं] ।'}
            ],
            lexicon_and_pos: [
                {sentence: 'मौसम सुहावना है।', chunks: '[NP मौसम] [ADJP सुहावना है] ।'},
                {sentence: 'बच्चे स्कूल जाते हैं।', chunks: '[NP बच्चे] [NP स्कूल] [VP जाते हैं] ।'}
            ]
        }
    }
};

// Utility to create info icon with tooltip
function infoIcon(text) {
    return `<span class="info-icon" tabindex="0" title="${text}">i</span>`;
}

// Render all steps at once
function renderAllSteps() {
    // Language
    document.getElementById('step-language').innerHTML =
        `<h3 class='step-heading'>1. Select Language</h3>
        <div class='dropdown-row'><select autocomplete='off' name='lang' id='lang-select'>
            <option value='null'>---Select Language---</option>
            <option value='eng'>English</option>
            <option value='hin'>Hindi</option>
        </select>${infoIcon(EXPLANATIONS.language)}</div>`;
    // Training size
    document.getElementById('step-train-size').style.display = '';
    document.getElementById('step-train-size').innerHTML =
        `<h3 class='step-heading'>2. Select Training Corpus Size</h3>
        <div class='dropdown-row'><select name='train' id='train' disabled>
            <option value='null'>---Select Size of Training corpus---</option>
        </select>${infoIcon(EXPLANATIONS.train)}</div>`;
    // Algorithm
    document.getElementById('step-algo').style.display = '';
    document.getElementById('step-algo').innerHTML =
        `<h3 class='step-heading'>3. Select Algorithm</h3>
        <div class='dropdown-row'><select name='algo' id='algo' disabled>
            <option value='null'>---Select Algorithm for Training---</option>
        </select>${infoIcon(EXPLANATIONS.algo)}</div>`;
    // Feature
    document.getElementById('step-feature').style.display = '';
    document.getElementById('step-feature').innerHTML =
        `<h3 class='step-heading'>4. Select Feature for Training</h3>
        <div class='dropdown-row'><select name='feature' id='feature' disabled>
            <option value='null'>---Select Feature for Training---</option>
        </select>${infoIcon(EXPLANATIONS.feature)}</div>`;
    // Accuracy
    document.getElementById('step-accuracy-container').innerHTML =
        `<button id='check-accuracy' class='sim-button' disabled>Check Accuracy</button>`;
}

// Enable/disable dropdowns as user selects
function setupStepLogic() {
    let lang = null, train = null, algo = null, feature = null, data = null;
    document.getElementById('lang-select').addEventListener('change', function() {
        lang = this.value;
        document.getElementById('train').disabled = (lang === 'null');
        if (lang !== 'null') {
            fetchDataFile(lang).then(d => {
                data = d;
                // Populate train dropdown
                const uniqueTrainTokens = [...new Set(data.map(row => row.train_token))];
                const trainTypeMap = {};
                data.forEach(row => {
                    if (!trainTypeMap[row.train_token]) trainTypeMap[row.train_token] = row.train_type;
                });
                let html = `<option value='null'>---Select Size of Training corpus---</option>`;
                uniqueTrainTokens.forEach(token => {
                    const tip = TOOLTIP.train[token] || '';
                    html += `<option value='${token} ${trainTypeMap[token]}' title='${tip}'>${token}</option>`;
                });
                document.getElementById('train').innerHTML = html;
            });
        }
        document.getElementById('train').value = 'null';
        document.getElementById('algo').value = 'null';
        document.getElementById('feature').value = 'null';
        document.getElementById('algo').disabled = true;
        document.getElementById('feature').disabled = true;
        document.getElementById('check-accuracy').disabled = true;
        document.getElementById('result-content').innerHTML = '';
    });
    document.getElementById('train').addEventListener('change', function() {
        train = this.value;
        document.getElementById('algo').disabled = (train === 'null');
        if (train !== 'null') {
            // Populate algo dropdown
            const trainToken = train.split(' ')[0];
            const algos = [...new Set(data.filter(row => row.train_token === trainToken).map(row => row.algo))];
            let html = `<option value='null'>---Select Algorithm for Training---</option>`;
            algos.forEach(algo => {
                const tip = TOOLTIP.algo[algo] || '';
                html += `<option value='${algo}' title='${tip}'>${algo}</option>`;
            });
            document.getElementById('algo').innerHTML = html;
        }
        document.getElementById('algo').value = 'null';
        document.getElementById('feature').value = 'null';
        document.getElementById('feature').disabled = true;
        document.getElementById('check-accuracy').disabled = true;
        document.getElementById('result-content').innerHTML = '';
    });
    document.getElementById('algo').addEventListener('change', function() {
        algo = this.value;
        document.getElementById('feature').disabled = (algo === 'null');
        if (algo !== 'null') {
            // Populate feature dropdown
            const trainToken = train.split(' ')[0];
            const features = [...new Set(data.filter(row => row.train_token === trainToken && row.algo === algo && row.feature !== 'none').map(row => row.feature))];
            let html = `<option value='null'>---Select Feature for Training---</option>`;
            features.forEach(feature => {
                const tip = TOOLTIP.feature[feature] || '';
                html += `<option value='${feature}' title='${tip}'>${feature}</option>`;
            });
            document.getElementById('feature').innerHTML = html;
        }
        document.getElementById('feature').value = 'null';
        document.getElementById('check-accuracy').disabled = true;
        document.getElementById('result-content').innerHTML = '';
    });
    document.getElementById('feature').addEventListener('change', function() {
        feature = this.value;
        document.getElementById('check-accuracy').disabled = (feature === 'null');
        document.getElementById('result-content').innerHTML = '';
    });
    document.getElementById('check-accuracy').addEventListener('click', function() {
        if (lang && train && algo && feature && data) {
            const trainToken = train.split(' ')[0];
            const row = data.find(row =>
                row.train_token === trainToken &&
                row.algo === algo &&
                row.feature === feature
            );
            let resultHtml = `<b>Accuracy is: </b>${row ? row.accuracy : 'N/A'}`;
            // Show example sentences
            const ex = (EXAMPLES[lang] && EXAMPLES[lang][algo] && EXAMPLES[lang][algo][feature]) || [];
            let exHtml = `<div class='example-heading'><br><b>Example Sentences with Predicted Chunks:</b></div>`;
            exHtml += `<div class='example-legend'><br>Each sentence below is shown with its predicted chunk labels.<br><span class='chunk-label'><b>[NP]</b></span> = Noun Phrase, <br><span class='chunk-label'><b>[VP]</b></span> = Verb Phrase, <br><span class='chunk-label'><b>[PP]</b></span> = Prepositional Phrase, <br><span class='chunk-label'><b>[ADJP]</b></span> = Adjective Phrase, <br><span class='chunk-label'><b>[ADVP]</b></span> = Adverb Phrase.<br><br></div>`;
            if (ex.length > 0) {
                ex.forEach(e => {
                    let chunked = e.chunks.replace(/\[/g, '<b>[</b>').replace(/\]/g, '<b>]</b>');
                    exHtml += `<div class='example-block'><span class='example-sentence'>${e.sentence}</span><span class='chunk-output'>${chunked}</span></div>`;
                });
            } else {
                exHtml += `<div class='example-block'>No example sentences available for this configuration.</div>`;
            }
            resultHtml += exHtml;
            document.getElementById('result-content').innerHTML = resultHtml;
        }
    });
}

// On DOMContentLoaded, render all steps and set up logic
window.addEventListener('DOMContentLoaded', function() {
    renderAllSteps();
    setupStepLogic();
    // Reset button logic
    const resetBtn = document.getElementById('reset-simulation');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            renderAllSteps();
            setupStepLogic();
            document.getElementById('result-content').innerHTML = '';
        });
    }
});
