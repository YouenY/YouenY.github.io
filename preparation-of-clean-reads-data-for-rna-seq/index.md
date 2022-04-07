# Preparation of clean read data for RNA-seq data analysis

{{< admonition type=summary title="Summary" open=false >}}
In this section, we are going to concatenate 4 read files from the same sample into 1 file and perform Fastqc, multiqc, and Trim_galore to check the quality of each read data.
{{< /admonition >}}

```markdown
{{< mermaid >}}
stateDiagram
[*] --> Concatenation
Concatenation --> FastQC
FastQC --> MultiQC
MultiQC --> Trim_galore
Trim_galore --> [*]
{{< /mermaid >}}
```



## 1. Concatenation of raw read files

First of all, the operating system (OS) I used is Linux Ubuntu 20.04.4. And what I have in my hand are 64 raw read fastq.gz files.

<img src="https://s2.loli.net/2022/04/06/tIpKFG8VBxmfM4N.png" style="zoom:50%;" />

What we need to do first is to concatenate 4 files into one, for example:

| File name (before)                  | File name(after)       |
| ----------------------------------- | ---------------------- |
| LAB_273_17_..._L001_R1_001.fastq.gz | LAB_273_17_R1.fastq.gz |
| LAB_273_17_..._L002_R1_001.fastq.gz |                        |
| LAB_273_17_..._L003_R1_001.fastq.gz |                        |
| LAB_273_17_..._L004_R1_001.fastq.gz |                        |

in Linux, open the terminal 

```shell
for name in *.fastq.gz; do

  printf '%s\n' "${name%_*_*_R[12]*}"

done | uniq |

while read prefix; do

  cat "$prefix"*R1*.fastq.gz >"${prefix}_R1.fastq.gz"

  cat "$prefix"*R2*.fastq.gz >"${prefix}_R2.fastq.gz"

done
```

Then check whether they are concatenated or not. 

