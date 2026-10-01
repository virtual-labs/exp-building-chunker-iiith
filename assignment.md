#### **Assignment 1: Chunking Patterns**

Complete the chunking pattern table for the following sentences. For each sentence, identify the noun phrase (NP), verb phrase (VP), and prepositional phrase (PP) chunks using standard chunking rules.

##### **Sentence**: "The quick brown fox jumps over the lazy dog."

| Chunk Type | Words Included      | Explanation                    |
| ---------- | ------------------- | ------------------------------ |
| NP         | The quick brown fox | Determiner + adjectives + noun |
| VP         | jumps               | Verb                           |
| PP         | over the lazy dog   | Preposition + NP               |

##### **Sentence**: "She gave the book to her friend."

| Chunk Type | Words Included | Explanation       |
| ---------- | -------------- | ----------------- |
| NP         | the book       | Determiner + noun |
| VP         | gave           | Verb              |
| PP         | to her friend  | Preposition + NP  |

---

#### **Assignment 2: Feature Selection for Chunking**

For each feature below, explain how it can improve chunking accuracy. Give examples from the simulation.

| Feature          | Example Usage                | Impact on Chunking Accuracy         |
| ---------------- | ---------------------------- | ----------------------------------- |
| POS tags         | NN, VB, DT                   | Helps identify chunk boundaries     |
| Lexical features | Specific words ("the", "of") | Can signal start/end of chunks      |
| Context window   | Previous/next tags           | Captures dependencies between words |

---

#### **Assignment 3: Comparing Chunking Algorithms**

Compare rule-based chunking and machine learning-based chunking for the following sentence:

**Sentence**: "A tall man with a blue hat walked quickly."

| Approach         | NP Chunks Identified   | VP Chunks Identified | PP Chunks Identified | Strengths             | Limitations             |
| ---------------- | ---------------------- | -------------------- | -------------------- | --------------------- | ----------------------- |
| Rule-based       | A tall man, a blue hat | walked quickly       | with a blue hat      | Simple, interpretable | May miss complex chunks |
| Machine learning | A tall man, a blue hat | walked quickly       | with a blue hat      | Learns from data      | Needs annotated corpus  |

---

#### **Assignment 4: Chunker Training and Evaluation**

Given a training corpus and a test sentence, describe the steps to train a chunker and evaluate its accuracy.

1. Tokenize the training corpus and assign POS tags.
2. Annotate chunk boundaries in the training data.
3. Train the chunker using selected features.
4. Apply the trained chunker to the test sentence.
5. Compare predicted chunks to gold standard and calculate accuracy.

---

#### **Assignment 5: Error Analysis and Improvement**

Identify errors in chunking for the sentence below and suggest corrections:

**Sentence**: "The students in the classroom are reading books."

| Incorrect Chunk  | Correction Needed  | Reason for Correction |
| ---------------- | ------------------ | --------------------- |
| in the classroom | Should be PP chunk | Preposition + NP      |
| reading books    | Should be VP chunk | Verb + NP             |

List three strategies to improve chunker accuracy:

1. Add more annotated training data.
2. Use richer features (context, word shape).
3. Tune chunking rules or model parameters.

---

#### **Assignment 6: Practical Application**

Generate chunked representations for the following sentences and explain your reasoning:

1. "The old man sat under the tree."
2. "She quickly finished her homework before dinner."

For each sentence, mark NP, VP, and PP chunks and justify your choices based on chunking rules or model predictions.
