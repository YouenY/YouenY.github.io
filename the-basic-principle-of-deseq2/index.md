# The basic principle of DESeq2 (1)


## How DESeq2 calculate DEGs?

DESeq2 tool was published in 2014 and it has been cited more than 30,000 times. ([reference](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-014-0550-8))

> DESeq2 is a method for differential analysis of count data, using shrinkage estimation for dispersions and fold changes to improve the stability and interpretability of estimates. 

### Library normalization by DEGs (median of ratios method)

RPKM, FPKM, TPM...... Those are methods for adjusting for the difference in overall read counts among libraries. 

However, **DESeq2 does not use those methods!** 

Why? :thinking: DESeq2 wanted its normalization to handle those 2 problems:

(1) Differences in **library sizes**

(2) Differences in **library composition** (liver vs spleen)

To normalize for sequencing depth and RNA composition, DESeq2 uses the median of ratios method. On the user-end there is only one step, but on the back-end there are multiple steps involved, as described below.

#### Step 1 Creates a pseudo-reference sample (row-wise geometric mean)

If we get such count data

| Gene ID | Sample1 | Sample2 | pseudo-reference              |
| ------- | ------- | ------- | ----------------------------- |
| 1       | 1489    | 906     | sqrt(1489 * 906) = **1161.5** |
| 2       | 22      | 13      | sqrt(22 * 13) = **17.7**      |
| ...     | ...     | ...     | ...                           |

We then calculated `pseudo-reference`, for each gene, a pseudo-reference sample is created that is equal to the geometric mean across all samples.

pseudo-reference=
$$
n\sqrt{A*B*C*...}
$$
For example, pseudo-reference for Gene 1 is 
$$
\sqrt{1489*906}
$$
{{< admonition type=notice title="Notice" open=false >}}

Notice: if there is count data=0, pseudo-reference=0 . No matter how other count is. 

{{< /admonition >}}

#### Step 2 Calculates ratio of each sample to the reference

| Gene ID | Sample1 | Sample2 | pseudo-reference | **ratio of sample1/ref** | **ratio of sample2/ref** |
| ------- | ------- | ------- | ---------------- | ------------------------ | ------------------------ |
| Gene 1  | 1489    | 906     | 1161.5           | 1489/1161.5 = **1.28**   | 906/1161.5 = **0.78**    |
| Gene 2  | 22      | 13      | 16.9             | 22/16.9 = **1.30**       | 13/16.9 = **0.77**       |
| ...     | ...     | ...     | ...              |                          |                          |

#### Step 3 Calculate the normalization factor for each sample (size factor)

The median value (column-wise for the above table) of all ratios for a given sample is taken as the normalization factor (size factor) for that sample, as calculated below. 

```
normalization_factor_sample1 <- median(c(1.28, 1.3, ...))
normalization_factor_sample2 <- median(c(0.78, 0.77, ...))
```

The median of ratios method makes the assumption that not ALL genes are differentially expressed; therefore, the normalization factors should account for sequencing depth and RNA composition of the sample (large outlier genes will not represent the median ratio values). **This method is robust to imbalance in up-/down-regulation and large numbers of differentially expressed genes.**

{{< admonition type=notice title="Notice" open=false >}}

Notice: usually size factors are around 1

{{< /admonition >}}

#### Step 4  Calculate the normalized count values using the normalization factor

Normalized Counts

| Gene ID | Sample1                  | Sample2                  |
| ------- | ------------------------ | ------------------------ |
| Gene 1  | 1489 / 1.3 = **1145.39** | 906 / 0.77 = **1176.62** |
| Gene 2  | 22 / 1.3 = **16.92**     | 13 / 0.77 = **16.88**    |
| …       | …                        | …                        |

The **median** further downplays genes that soak up a lot of the reads, putting more emphasis on moderately expressed genes.




