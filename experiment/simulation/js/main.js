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
    language: 'Select the language for which you want to build the chunker. Language affects the data and model performance.',
    train: 'Choose the size of the training corpus. Larger corpora usually lead to better model accuracy.',
    algo: 'Select the algorithm for training the chunker. CRF (Conditional Random Fields) and HMM (Hidden Markov Model) are common sequence models.',
    feature: 'Select which features to use for training. Features influence what information the model uses to make predictions.'
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

// Populate the language dropdown and handle selection
function setupLanguageSelection() {
    const langSelect = document.querySelector('select[name="lang"]');
    if (!langSelect) return;
    // Add explanation above language dropdown
    langSelect.parentElement.insertAdjacentHTML('beforebegin', `<div class="explanation">${EXPLANATIONS.language}</div>`);
    // Add tooltips to language options
    Array.from(langSelect.options).forEach(opt => {
        if (TOOLTIP.lang[opt.value]) opt.title = TOOLTIP.lang[opt.value];
    });
    langSelect.addEventListener('change', function() {
        const lang = this.value;
        document.getElementById('step-train-size').innerHTML = '';
        document.getElementById('step-train-size').classList.add('step-hidden');
        document.getElementById('step-algo').innerHTML = '';
        document.getElementById('step-algo').classList.add('step-hidden');
        document.getElementById('step-feature').innerHTML = '';
        document.getElementById('step-feature').classList.add('step-hidden');
        document.getElementById('step-accuracy').innerHTML = '';
        document.getElementById('step-accuracy').classList.add('step-hidden');
        if (lang === 'null') return;
        renderTrainSizeDropdown(lang);
    });
}

// Render the training size dropdown based on selected language
function renderTrainSizeDropdown(language) {
    fetchDataFile(language).then(data => {
        const uniqueTrainTokens = [...new Set(data.map(row => row.train_token))];
        const trainTypeMap = {};
        data.forEach(row => {
            if (!trainTypeMap[row.train_token]) {
                trainTypeMap[row.train_token] = row.train_type;
            }
        });
        let html = `<h3 class='step-heading'>2. Select Training Corpus Size</h3>`;
        html += `<div class='explanation'>Choose the size of the training corpus.<br>Larger corpora usually lead to better model accuracy.</div>`;
        html += `<select name='train' id='train'>
        <option value='null'>---Select Size of Training corpus---</option>`;
        uniqueTrainTokens.forEach(token => {
            const tip = TOOLTIP.train[token] || '';
            html += `<option value='${token} ${trainTypeMap[token]}' title='${tip}'>${token}</option>`;
        });
        html += `</select>`;
        document.getElementById('step-train-size').innerHTML = html;
        document.getElementById('step-train-size').classList.remove('step-hidden');
        document.getElementById('train').addEventListener('change', function() {
            const train = this.value;
            if (train === 'null') return;
            renderAlgorithmDropdown(language, train, data);
        });
        // Clear next steps and hide them
        document.getElementById('step-algo').innerHTML = '';
        document.getElementById('step-algo').classList.add('step-hidden');
        document.getElementById('step-feature').innerHTML = '';
        document.getElementById('step-feature').classList.add('step-hidden');
        document.getElementById('step-accuracy').innerHTML = '';
        document.getElementById('step-accuracy').classList.add('step-hidden');
    });
}

// Render the algorithm dropdown after training size is selected
function renderAlgorithmDropdown(language, train, data) {
    const trainToken = train.split(' ')[0];
    const algos = [...new Set(data.filter(row => row.train_token === trainToken).map(row => row.algo))];
    let html = `<h3 class='step-heading'>3. Select Algorithm</h3>`;
    html += `<div class='explanation'>Select the algorithm for training the chunker.<br>CRF (Conditional Random Fields) and HMM (Hidden Markov Model) are common sequence models.</div>`;
    html += `<select name='algo' id='algo'>
    <option value='null'>---Select Algorithm for Training---</option>`;
    algos.forEach(algo => {
        const tip = TOOLTIP.algo[algo] || '';
        html += `<option value='${algo}' title='${tip}'>${algo}</option>`;
    });
    html += `</select>`;
    document.getElementById('step-algo').innerHTML = html;
    document.getElementById('step-algo').classList.remove('step-hidden');
    document.getElementById('algo').addEventListener('change', function() {
        const algo = this.value;
        if (algo === 'null') return;
        renderFeaturesDropdown(language, train, algo, data);
    });
    // Clear next steps and hide them
    document.getElementById('step-feature').innerHTML = '';
    document.getElementById('step-feature').classList.add('step-hidden');
    document.getElementById('step-accuracy').innerHTML = '';
    document.getElementById('step-accuracy').classList.add('step-hidden');
}

// Render the feature dropdown after algorithm is selected
function renderFeaturesDropdown(language, train, algo, data) {
    const trainToken = train.split(' ')[0];
    const features = [...new Set(data.filter(row => row.train_token === trainToken && row.algo === algo && row.feature !== 'none').map(row => row.feature))];
    let html = `<h3 class='step-heading'>4. Select Feature for Training</h3>`;
    html += `<div class='explanation'>Select which features to use for training.<br>Features influence what information the model uses to make predictions.</div>`;
    html += `<select name='feature' id='feature'>
    <option value='null'>---Select Feature for Training---</option>`;
    features.forEach(feature => {
        const tip = TOOLTIP.feature[feature] || '';
        html += `<option value='${feature}' title='${tip}'>${feature}</option>`;
    });
    html += `</select>`;
    document.getElementById('step-feature').innerHTML = html;
    document.getElementById('step-feature').classList.remove('step-hidden');
    document.getElementById('feature').addEventListener('change', function() {
        const feature = this.value;
        if (feature === 'null') return;
        renderAccuracy(language, train, algo, feature, data);
    });
    // Clear next step and hide it
    document.getElementById('step-accuracy').innerHTML = '';
    document.getElementById('step-accuracy').classList.add('step-hidden');
}

// Render the accuracy check button and display accuracy on click
function renderAccuracy(language, train, algo, feature, data) {
    const trainToken = train.split(' ')[0];
    const row = data.find(row =>
        row.train_token === trainToken &&
        row.algo === algo &&
        row.feature === feature
    );
    let html = `<h3 class='step-heading'>5. Check Accuracy</h3>`;
    html += `<div class='explanation'>Training is completed.</div>`;
    html += `<button id='check-accuracy'>Check Accuracy</button>`;
    html += `<div id='accuracy_ans'></div>`;
    html += `<div id='example-sentences'></div>`;
    document.getElementById('step-accuracy').innerHTML = html;
    document.getElementById('step-accuracy').classList.remove('step-hidden');
    document.getElementById('check-accuracy').addEventListener('click', function() {
        document.getElementById('accuracy_ans').innerHTML = `<b>Accuracy is: </b>${row ? row.accuracy : 'N/A'}`;
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
        if (resetBtn) resetBtn.style.display = '';
    });
}

// Reset simulation to initial state
function resetSimulation() {
    // Clear all dynamic content
    document.getElementById('step-train-size').innerHTML = '';
    document.getElementById('step-train-size').classList.add('step-hidden');
    const algoDiv = document.getElementById('step-algo');
    if (algoDiv) algoDiv.innerHTML = '';
    const featuresDiv = document.getElementById('step-feature');
    if (featuresDiv) featuresDiv.innerHTML = '';
    const accuracyDiv = document.getElementById('step-accuracy');
    if (accuracyDiv) accuracyDiv.innerHTML = '';
    // Reset language dropdown
    const langSelect = document.querySelector('select[name="lang"]');
    if (langSelect) langSelect.value = 'null';
    // Hide reset button
    const resetBtn = document.getElementById('reset-simulation');
    if (resetBtn) resetBtn.style.display = 'none';
}

// Initial setup
window.addEventListener('DOMContentLoaded', function() {
    // Render language step with heading and explanation
    document.getElementById('step-language').innerHTML = `
        <h3 class='step-heading'>1. Select Language</h3>
        <div class='explanation'>Select the language for which you want to build the chunker. Language affects the data and model performance.</div>
        <select autocomplete='off' name='lang' id='lang-select'>
            <option value='null'>---Select Language---</option>
            <option value='eng'>English</option>
            <option value='hin'>Hindi</option>
        </select>
    `;
    // Language selection event
    document.getElementById('lang-select').addEventListener('change', function() {
        const lang = this.value;
        if (lang === 'null') {
            document.getElementById('step-train-size').innerHTML = '';
            document.getElementById('step-train-size').classList.add('step-hidden');
            document.getElementById('step-algo').innerHTML = '';
            document.getElementById('step-algo').classList.add('step-hidden');
            document.getElementById('step-feature').innerHTML = '';
            document.getElementById('step-feature').classList.add('step-hidden');
            document.getElementById('step-accuracy').innerHTML = '';
            document.getElementById('step-accuracy').classList.add('step-hidden');
            return;
        }
        renderTrainSizeDropdown(lang);
    });
    // Reset button
    const resetBtn = document.getElementById('reset-simulation');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            document.getElementById('step-language').innerHTML = `
                <h3 class='step-heading'>1. Select Language</h3>
                <div class='explanation'>Select the language for which you want to build the chunker. Language affects the data and model performance.</div>
                <select autocomplete='off' name='lang' id='lang-select'>
                    <option value='null'>---Select Language---</option>
                    <option value='eng'>English</option>
                    <option value='hin'>Hindi</option>
                </select>
            `;
            document.getElementById('lang-select').addEventListener('change', function() {
                const lang = this.value;
                if (lang === 'null') {
                    document.getElementById('step-train-size').innerHTML = '';
                    document.getElementById('step-train-size').classList.add('step-hidden');
                    document.getElementById('step-algo').innerHTML = '';
                    document.getElementById('step-algo').classList.add('step-hidden');
                    document.getElementById('step-feature').innerHTML = '';
                    document.getElementById('step-feature').classList.add('step-hidden');
                    document.getElementById('step-accuracy').innerHTML = '';
                    document.getElementById('step-accuracy').classList.add('step-hidden');
                    return;
                }
                renderTrainSizeDropdown(lang);
            });
            document.getElementById('step-train-size').innerHTML = '';
            document.getElementById('step-train-size').classList.add('step-hidden');
            document.getElementById('step-algo').innerHTML = '';
            document.getElementById('step-algo').classList.add('step-hidden');
            document.getElementById('step-feature').innerHTML = '';
            document.getElementById('step-feature').classList.add('step-hidden');
            document.getElementById('step-accuracy').innerHTML = '';
            document.getElementById('step-accuracy').classList.add('step-hidden');
            resetBtn.style.display = 'none';
        });
    }
});
