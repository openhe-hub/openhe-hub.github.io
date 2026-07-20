---
title: "What Makes a VLA a VLA?"
date: 2026-07-20
description: "Vision-language-action models keep absorbing ideas from LLM land. A short note on the three design axes that actually matter: tokenization of actions, the backbone, and the data mix."
tags: [vla, manipulation, foundation-models]
---

Every month there is a new vision-language-action model, and every month the diagram looks the same: images and instructions go in, actions come out. The differences that matter hide in three places.

## Action tokenization

The output space is where VLAs diverge most. Discretizing each action dimension into bins turns control into next-token prediction, while diffusion or flow-matching heads keep actions continuous:

$$
\pi_\theta(a_t \mid o_t, \ell) \quad \text{vs.} \quad a_t = f_\theta(o_t, \ell, \epsilon), \;\; \epsilon \sim \mathcal{N}(0, I)
$$

Binning is simple and plays well with a pretrained LM head; continuous heads tend to be smoother at high control rates.

## A demo clip

Below is a placeholder clip — drop any short `.mp4` next to the markdown file and reference it with an absolute `/assets/...` path:

<video src="/assets/robotics/vla/demo.mp4" controls muted playsinline></video>

*A test pattern standing in for a rollout video.*

## The data mix

| Source | Scale | What it buys |
| --- | --- | --- |
| Web image–text | huge | open-vocabulary grounding |
| Cross-embodiment robot data | medium | transferable skills |
| In-domain teleop | small | the last mile |

The recurring lesson: co-training with web data is not optional — dropping it collapses generalization to novel objects and instructions.
