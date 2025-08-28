### Core Chunking Terms

**Chunking**: The process of grouping words in a sentence into syntactic phrases (chunks), such as noun phrases (NP), verb phrases (VP), and prepositional phrases (PP), without building a full parse tree.

**Chunk**: A non-overlapping, non-recursive group of words that form a meaningful unit. Example: "the current account deficit" (NP), "will narrow" (VP).

**IOB Tagging**: A scheme for marking chunk boundaries:

- **B-** (Beginning): Marks the first word of a chunk
- **I-** (Inside): Marks subsequent words in the same chunk
- **O** (Outside): Marks words not part of any chunk

**Noun Phrase (NP)**: A chunk containing a noun and its modifiers. Example: "the red ball"
**Verb Phrase (VP)**: A chunk containing a verb and its auxiliaries or complements. Example: "is running fast"
**Prepositional Phrase (PP)**: A chunk starting with a preposition and its object. Example: "in the park"

### Machine Learning Terms

**Hidden Markov Model (HMM)**: A probabilistic model for sequence labeling, used to predict chunk tags based on word and tag probabilities.
**Conditional Random Field (CRF)**: A discriminative model for structured prediction, allowing richer feature sets for chunking.

**Feature**: A property or attribute of a word or its context (e.g., lexicon, POS tag) used by the model to make predictions.
**Training Corpus**: A labeled dataset used to train the chunker.

### Analysis Terms

**Chunk Boundary**: The point in a sentence where one chunk ends and another begins.
**Gold Standard Annotation**: The correct chunking of a sentence, used for evaluation.
**Chunking Accuracy**: The percentage of correctly identified chunks compared to the gold standard.
**Shallow Parsing**: Another term for chunking, focusing on phrase-level analysis rather than full syntactic parsing.
