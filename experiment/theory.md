### Visualizing Chunking vs. Full Parsing

The following diagram illustrates the difference between chunking and full parsing for the sentence:

**I felt conscious of my intellectual nullity.**

![Chunking vs. Parsing](./images/experiment-image.png)

- **Chunker (Top-Left):** The sentence is divided into non-overlapping chunks, such as [I felt] and [my intellectual nullity]. Each chunk is a meaningful group, but the internal structure of each chunk is not shown.
- **Inside Parser (Top-Right):** Shows the grammatical relationships within a single chunk.
- **Outside Parser (Bottom-Left):** Shows how chunks relate to each other, but not the internal structure.
- **Full Parser (Bottom-Right):** Shows all grammatical relationships in the sentence, both within and between chunks.

**Chunking** is useful for quickly identifying the main building blocks of a sentence, while **full parsing** provides a complete syntactic analysis. In this experiment, you will focus on building a chunker and understanding how different features and training data sizes affect its performance.

---

### Theory: Building a Chunker in NLP

**Chunking in NLP**

Chunking, also known as shallow parsing, is the process of dividing a sentence into its constituent parts, such as noun phrases (NP), verb phrases (VP), and prepositional phrases (PP). Unlike full parsing, chunking does not produce a complete syntactic tree, but instead identifies non-overlapping, non-recursive groups of words that form meaningful units. These chunks help in various downstream NLP tasks, such as information extraction and question answering.

**Why is Chunking Important?**

Chunking simplifies the structure of sentences, making it easier to analyze and extract information. For example, identifying all noun phrases in a sentence can help in extracting entities or subjects.

**Machine Learning Approaches to Chunking**

In this experiment, we use two popular sequence modeling algorithms to build a chunker:

#### Hidden Markov Model (HMM)

HMMs are probabilistic models that predict the most likely sequence of labels (such as chunk tags) for a given sequence of words. They use the probabilities of transitions between states (tags) and the likelihood of observing a word given a tag. HMMs are effective for tasks where the context of neighboring words is important, such as part-of-speech tagging and chunking.

More advanced ("higher order") HMMs can learn the probabilities of longer sequences, not just pairs of tags. This allows the model to better capture context, but also increases complexity. HMMs have been widely used in NLP for tasks like part-of-speech tagging and chunking, and can achieve high accuracy by leveraging statistical patterns in language.

#### Conditional Random Field (CRF)

CRFs are a type of discriminative probabilistic model used for structured prediction. Unlike HMMs, CRFs can consider a wider range of features and dependencies in the data, making them more flexible and often more accurate for tasks like chunking. CRFs can incorporate information from the entire input sequence, not just local context, and are especially effective when rich features (such as both lexical and part-of-speech information) are available.

**Role of Features and Corpus Size**

- *Feature Selection*: The choice of features (such as lexical features, part-of-speech tags, or a combination) greatly affects the model's ability to correctly identify chunks. Richer feature sets often lead to better performance.
- *Training Corpus Size*: Larger training corpora provide more examples for the model to learn from, generally resulting in higher accuracy. However, there are diminishing returns as the corpus size increases.

**Summary**

In this experiment, you will explore how different algorithms (HMM and CRF), feature sets, and training corpus sizes impact the performance of a chunker. By experimenting with these variables, you will gain hands-on insight into the key factors that influence chunking accuracy in NLP. 