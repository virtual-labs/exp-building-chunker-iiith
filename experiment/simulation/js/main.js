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
    algo: 'CRF (Conditional Random Fields) and HMM (Hidden Markov Model) are common sequence models.',
    feature: 'Features influence what information the model uses to make predictions.'
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

let fullData = [];

// Helper to create a dropdown control with a tooltip
function createDropdownControl(id, label, explanation) {
    return `
        <div class="sim-control-group">
            <select name="${id}" id="${id}" title="${label}">
                <option value="null">${label}</option>
            </select>
            <div class="info-tooltip">
                <i class="fas fa-info-circle"></i>
                <span class="tooltip-text">${explanation}</span>
            </div>
        </div>
    `;
}

// Render initial dropdowns
function setupInitialState() {
    const stepsContainer = document.getElementById('simulation-steps-col');
    
    // 1. Language
    let langHtml = createDropdownControl('lang-select', '---Select Language---', EXPLANATIONS.language);

    // 2. Train Size
    let trainHtml = createDropdownControl('train-select', '---Select Training Corpus Size---', EXPLANATIONS.train);

    // 3. Algorithm
    let algoHtml = createDropdownControl('algo-select', '---Select Algorithm---', EXPLANATIONS.algo);

    // 4. Feature
    let featureHtml = createDropdownControl('feature-select', '---Select Feature---', EXPLANATIONS.feature);

    stepsContainer.innerHTML = langHtml + trainHtml + algoHtml + featureHtml;

    // Manually add static options for the language selector
    const langSelect = document.getElementById('lang-select');
    langSelect.add(new Option('English', 'eng'));
    langSelect.add(new Option('Hindi', 'hin'));
    
    // Disable dependent dropdowns initially
    document.getElementById('train-select').disabled = true;
    document.getElementById('algo-select').disabled = true;
    document.getElementById('feature-select').disabled = true;

    // Add event listeners
    document.getElementById('lang-select').addEventListener('change', handleLanguageChange);
    document.getElementById('train-select').addEventListener('change', handleTrainSizeChange);
    document.getElementById('algo-select').addEventListener('change', handleAlgoChange);
    document.getElementById('feature-select').addEventListener('change', handleFeatureChange);
}

// Handlers for dropdown changes
function handleLanguageChange() {
    const lang = this.value;
    const trainSelect = document.getElementById('train-select');
    const algoSelect = document.getElementById('algo-select');
    const featureSelect = document.getElementById('feature-select');

    // Reset and disable dependent dropdowns
    trainSelect.innerHTML = '<option value="null">---Select Training Corpus Size---</option>';
    trainSelect.disabled = true;
    algoSelect.innerHTML = '<option value="null">---Select Algorithm---</option>';
    algoSelect.disabled = true;
    featureSelect.innerHTML = '<option value="null">---Select Feature---</option>';
    featureSelect.disabled = true;
    clearAccuracy();

    if (lang === 'null') return;

    fetchDataFile(lang).then(data => {
        fullData = data;
        const uniqueTrainTokens = [...new Set(data.map(row => row.train_token))];
        uniqueTrainTokens.forEach(token => {
            const tip = TOOLTIP.train[token] || '';
            trainSelect.add(new Option(token, token, false, false));
            trainSelect.options[trainSelect.options.length - 1].title = tip;
        });
        trainSelect.disabled = false;
    });
}

function handleTrainSizeChange() {
    const trainToken = this.value;
    const algoSelect = document.getElementById('algo-select');
    const featureSelect = document.getElementById('feature-select');

    algoSelect.innerHTML = '<option value="null">---Select Algorithm---</option>';
    algoSelect.disabled = true;
    featureSelect.innerHTML = '<option value="null">---Select Feature---</option>';
    featureSelect.disabled = true;
    clearAccuracy();

    if (trainToken === 'null') return;

    const algos = [...new Set(fullData.filter(row => row.train_token === trainToken).map(row => row.algo))];
    algos.forEach(algo => {
        const tip = TOOLTIP.algo[algo] || '';
        algoSelect.add(new Option(algo, algo, false, false));
        algoSelect.options[algoSelect.options.length - 1].title = tip;
    });
    algoSelect.disabled = false;
}

function handleAlgoChange() {
    const algo = this.value;
    const trainToken = document.getElementById('train-select').value;
    const featureSelect = document.getElementById('feature-select');
    
    featureSelect.innerHTML = '<option value="null">---Select Feature---</option>';
    featureSelect.disabled = true;
    clearAccuracy();

    if (algo === 'null') return;

    const features = [...new Set(fullData.filter(row => row.train_token === trainToken && row.algo === algo && row.feature !== 'none').map(row => row.feature))];
    features.forEach(feature => {
        const tip = TOOLTIP.feature[feature] || '';
        featureSelect.add(new Option(feature, feature, false, false));
        featureSelect.options[featureSelect.options.length - 1].title = tip;
    });
    featureSelect.disabled = false;
}

function handleFeatureChange() {
    const feature = this.value;
    clearAccuracy();
    if (feature === 'null') return;

    const lang = document.getElementById('lang-select').value;
    const trainToken = document.getElementById('train-select').value;
    const algo = document.getElementById('algo-select').value;

    renderAccuracy(lang, trainToken, algo, feature, fullData);
}

function clearAccuracy() {
    document.getElementById('step-accuracy').innerHTML = '';
    document.getElementById('step-accuracy').classList.add('step-hidden');
    document.getElementById('reset-simulation').style.display = 'none';
}

// Render the accuracy check button and display accuracy on click
function renderAccuracy(language, trainToken, algo, feature, data) {
    const row = data.find(r =>
        r.train_token === trainToken &&
        r.algo === algo &&
        r.feature === feature
    );
    let html = `<div class='explanation'>Training is completed.</div>`;
    html += `<button id='check-accuracy'>Check Accuracy</button>`;
    html += `<div id='accuracy_ans'></div>`;
    html += `<div id='example-sentences'></div>`;
    document.getElementById('step-accuracy').innerHTML = html;
    document.getElementById('step-accuracy').classList.remove('step-hidden');
    document.getElementById('check-accuracy').addEventListener('click', function() {
        // Find the accuracy again
        const accuracyRow = data.find(r =>
            r.train_token === trainToken &&
            r.algo === algo &&
            r.feature === feature
        );
        document.getElementById('accuracy_ans').innerHTML = `<b>Accuracy is: </b>${accuracyRow ? accuracyRow.accuracy : 'N/A'}`;
        // Hide the button after click
        this.style.display = 'none';
        
        // Show example sentences
        const ex = (EXAMPLES[language] && EXAMPLES[language][algo] && EXAMPLES[language][algo][feature]) || [];
        let exHtml = `<div class='example-heading'>Example Sentences with Predicted Chunks:</div>`;
        exHtml += `<div class='example-legend'>Each sentence below is shown with its predicted chunk labels.<br><span class='chunk-label'>[NP]</span> = Noun Phrase, <span class='chunk-label'>[VP]</span> = Verb Phrase, <span class='chunk-label'>[PP]</span> = Prepositional Phrase, <span class='chunk-label'>[ADJP]</span> = Adjective Phrase, <span class='chunk-label'>[ADVP]</span> = Adverb Phrase.</div>`;
        if (ex.length > 0) {
            ex.forEach(e => {
                let chunked = e.chunks.replace(/\[(NP|VP|PP|ADJP|ADVP)\]/g, '<span class="chunk-label">[$1]</span>');
                exHtml += `<div class='example-block'><span class='example-sentence'>${e.sentence}</span><span class='chunk-output'>${chunked}</span></div>`;
            });
        } else {
            exHtml += `<div class='example-block'>No example sentences available for this configuration.</div>`;
        }
        document.getElementById('example-sentences').innerHTML = exHtml;
        // Show reset button
        const resetBtn = document.getElementById('reset-simulation');
        if (resetBtn) resetBtn.style.display = 'block';
    });
}

// Reset simulation to initial state
function resetSimulation() {
    setupInitialState(); // Re-initialize the dropdowns
    clearAccuracy();
}

// Initial setup
window.addEventListener('DOMContentLoaded', function() {
    setupInitialState();
    
    // Reset button
    const resetBtn = document.getElementById('reset-simulation');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSimulation);
    }
});
