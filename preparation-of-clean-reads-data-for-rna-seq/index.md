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

## 2. Use fastqc to perform quality checks

Here is the homepage for fastqc and you can easily follow the instructions.

https://www.bioinformatics.babraham.ac.uk/projects/download.html#fastqc

### 2.1 installing Java Runtime Environment (JRE)

```shell
sudo apt install default-jre
```

Then check whether JRE is properly installed:

```shell
java -version
```

### 2.2 installing Fastqc software

```shell
sudo -i 
apt install fastqc
fastqc -version
```

### 2.3 Run fastqc

```shell
fastqc *.gz
```

which means fastqc all files with .gz

you will get one html file for 1 sample like XXXX_fastqc.html

## 3. Using multiqc to summarize the results of fastqc

### 3.1 installing conda

https://docs.conda.io/projects/conda/en/latest/user-guide/install/linux.html

### 3.2 installing python

```shell
conda create --name py3.7 python=3.7 
conda activate py3.7
python -version
```

### 3.3 installing multiqc

```shell
conda install -c bioconda -c conda-forge multiqc
```

### 3.4 Run multiqc

```shell
multiqc . #run multiqc for all fastqc reults files (.html)
```

## 4. Discussion

For detailed explanation of each result in fastqc and multiqc, I will generate another article for it~ :wink:

