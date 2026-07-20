---
title: "Notes on 3D Gaussian Splatting"
date: 2026-07-18
description: "A working note on the 3DGS representation: anisotropic covariance parameterization, the projection to screen space, and why the whole thing rasterizes so fast."
tags: [3dgs, nerf, rendering]
---

3D Gaussian Splatting represents a scene as a set of anisotropic 3D Gaussians, each carrying opacity and view-dependent color. This note walks through the parts I keep re-deriving.

## The representation

Each Gaussian is defined by a center $\mu \in \mathbb{R}^3$ and a covariance matrix $\Sigma$:

$$
G(x) = \exp\!\left(-\tfrac{1}{2}(x-\mu)^\top \Sigma^{-1} (x-\mu)\right)
$$

To keep $\Sigma$ positive semi-definite during optimization, it is parameterized as a rotation and a scale:

$$
\Sigma = R\,S\,S^\top R^\top
$$

where $S = \mathrm{diag}(s_x, s_y, s_z)$ and $R$ comes from a unit quaternion $q$.

![Placeholder figure](./splat-figure.png)

*Figure 1. Placeholder for a splat visualization — replace with a real render.*

## Projection to screen space

Given a viewing transformation $W$ and the Jacobian $J$ of the affine approximation of the projective transformation, the 2D covariance is

$$
\Sigma' = J\,W\,\Sigma\,W^\top J^\top
$$

Dropping the third row and column of $\Sigma'$ gives the 2D splat used for rasterization.

## A minimal data structure

```python
@dataclass
class Gaussian:
    mean: Float[Tensor, "3"]        # mu
    quat: Float[Tensor, "4"]        # rotation as unit quaternion
    scale: Float[Tensor, "3"]       # log-scale, exp() at use time
    opacity: Float[Tensor, ""]      # pre-sigmoid
    sh: Float[Tensor, "K 3"]        # spherical harmonics coefficients
```

The tile-based rasterizer sorts splats front-to-back per 16×16 tile, then alpha-composites — the sort is the trick that makes it real-time.

## What I want to test next

- How much of the quality survives with isotropic Gaussians only
- Whether opacity pruning schedules transfer across scenes
- Depth regularization for sparse-view settings
