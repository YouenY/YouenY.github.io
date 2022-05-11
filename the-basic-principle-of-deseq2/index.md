# The basic principle of DESeq2 (1)


## How DESeq2 calculated DEGs?

DESeq2 tool was published in 2014 and it has been cited more than 30,000 times. ([reference](https://genomebiology.biomedcentral.com/articles/10.1186/s13059-014-0550-8))

> DESeq2 is a method for differential analysis of count data, using shrinkage estimation for dispersions and fold changes to improve the stability and interpretability of estimates. 

### Library normalization by DEGs

RPKM, FPKM, TPM...... Those are methods for adjusting for the difference in overall read counts among libraries. 

However, **DESeq2 does not use those methods!** 

Why? :thinking: DESeq2 wanted its normalization to handle those 2 problems:

(1) Differences in **library sizes**

(2) Differences in **library composition** (liver vs spleen)

#### Step 1 Take the log of all the values

If we get such count data

| Gene ID | Sample1 | Sample2 | Sample3 |
| ------- | ------- | ------- | ------- |
| Gene1   | A       | B       | C       |
| Gene2   | D       | E       | 0       |
| Gene3   | X       | Y       | Z       |

We than calculated `ln(count data)`(log base e), and we will get a new table.

| Gene ID | Sample1 | Sample2 | Sample3 |
| ------- | ------- | ------- | ------- |
| Gene1   | ln(A)   | ln(B)   | ln(C)   |
| Gene2   | ln(D)   | ln(E)   | error   |
| Gene3   | ln(X)   | ln(Y)   | ln(Z)   |

{{< admonition type=notice title="Notice" open=false >}}

Notice: if count data=0, `In(0) = -inf`. DEseq will output `NA`

{{< /admonition >}}

#### Step 2 Average each row

| Gene ID | Average of log value  |
| ------- | --------------------- |
| Gene 1  | [ln(A)+ln(B)+ln(C)]/3 |
| Gene 2  | error                 |
| Gene 3  | [ln(X)+ln(Y)+ln(Z)]/3 |

Which means that only one count=0 will lead to error in the average. 

#### Step 3 Filter out genes with error

| Gene ID | Average of log value  |
| ------- | --------------------- |
| Gene 1  | [ln(A)+ln(B)+ln(C)]/3 |
| Gene 3  | [ln(X)+ln(Y)+ln(Z)]/3 |

Gene 2 is removed!

#### Step 4 Subtract the average log value from the log(counts)

| Gene ID | Sample 1                    | Sample 2                    | Sample 3                    |
| ------- | --------------------------- | --------------------------- | --------------------------- |
| Gene 1  | ln(A)-[ln(A)+ln(B)+ln(C)]/3 | ln(B)-[ln(A)+ln(B)+ln(C)]/3 | ln(C)-[ln(A)+ln(B)+ln(C)]/3 |
| Gene 2  | ln(X)-[ln(X)+ln(Y)+ln(Z)]/3 | ln(Y)-[ln(X)+ln(Y)+ln(Z)]/3 | ln(Z)-[ln(X)+ln(Y)+ln(Z)]/3 |

#### Step 5 Calculate the median of the ratios for each sample

|        | Sample 1                                                    | Sample 2                                                    | Sample 3                                                    |
| ------ | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| median | (ln(A)-[ln(A)+ln(B)+ln(C)]/3+ln(X)-[ln(X)+ln(Y)+ln(Z)]/3)/2 | (ln(B)-[ln(A)+ln(B)+ln(C)]/3+ln(Y)-[ln(X)+ln(Y)+ln(Z)]/3)/2 | (ln(C)-[ln(A)+ln(B)+ln(C)]/3+ln(Z)-[ln(X)+ln(Y)+ln(Z)]/3)/2 |

#### Step 6 Calculate the scaling factors (SF)

|      | Sample 1          | Sample 2          | Sample 3          |
| ---- | ----------------- | ----------------- | ----------------- |
| SF   | e^median(sample1) | e^median(sample2) | e^median(sample3) |

#### Step 7 Divide the original read counts by the scaling factors

We will get scaled read counts!

| Gene ID | Sample1       | Sample2       | Sample3       |
| ------- | ------------- | ------------- | ------------- |
| Gene1   | A/SF(Sample1) | B/SF(Sample2) | C/SF(Sample3) |
| Gene2   | D/SF(Sample1) | E/SF(Sample2) | 0/SF(Sample3) |
| Gene3   | X/SF(Sample1) | Y/SF(Sample2) | Z/SF(Sample3) |

**Logs** eliminate all genes that are only transcribed in one sample type.

They also help smooth over outlier read counts.

The **median** further downplays genes that soak up a lot of the reads, putting more emphasis on moderately expressed gene.




