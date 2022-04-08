# 2. Trim the read files using trim_galore


{{< admonition type=summary title="Summary" open=false >}}

In this section, we are going to install `trimgalore` and perform trimming to improve the qualities of read files.

{{< /admonition >}}

## 1. Why do we need to trim?

>   Quality trimming decreases the overall number of reads, but increases to the total and proportion of uniquely mapped reads. Thus, you get more useful data for downstream analyses. Too aggressive quality trimming can negatively impact downstream analysis. 

:man_teacher: : Trimming will delete low-quality reads!!! We must use trimming before mapping!!!

:woman_teacher: : Trimming may delete some important reads!!! Even trash reads is needed for mapping!!!

:bulb: **So, whether to trim or not depends on your project and the results of your fastqc results!!!**

## 2. Evaluate the quality of reads using `Fastqc`

The usage of `Fastqc` has been described before in the [last article](https://youeny.github.io/preparation-of-clean-reads-data-for-rna-seq/).

### 2.1 Per base sequence quality

<img src="https://s2.loli.net/2022/04/08/IWVoEHvpxZ4L2yT.png" style="zoom:90%;" />

:warning: As this figure (per base sequence quality) showed, the last 10 base pairs had low quality, especially the last one ( in the fail bar :red_circle:). So, I decided to perform trimming for this sample.

## 3. Use `Trim galore` to trim

{{< admonition type=tip title="Tip" open=false >}}
This article is based on the [instruction of trim galore](https://github.com/FelixKrueger/TrimGalore/blob/master/Docs/Trim_Galore_User_Guide.md).
{{< /admonition >}}

### 3.1 installing of `trim galore`

[download site](https://github.com/FelixKrueger/TrimGalore/releases) (github)

```shell
#Download the tar.gz file of trim galore
tar -zxvf 0.6.7.tar.gz
```

```shell
trim_galore -version

trim_galore --help
```

### 3.2 Run `trim galore`

```shell
trim_galore -q 25 --phred 33 --stringency 3 --length 30 --paired 1_R1.fastq.gz 1_R2.fastq.gz --gzip -o./cleandata
```

one paired samples take about 15 min. 

:heavy_check_mark: **For trimming every sample at once,** please refer to [this article](https://cloud.tencent.com/developer/article/1703054) (Chinese material)

```shell
for i in 13 14 15 16 17 18
do 
	trim_galore -q 25 --phred 33 --stringency 3 --length 30 --paired /wkdir/${i}_1.fq.gz /wkdir/${i}_2.fq.gz --gzip -o /home/xxx/RNA-seq/trimmed files
done
```

### 4. Run `fastqc` & `multiqc` again 

After trimming, we need to check the quality again.

```shell
fastqc *.gz
multiqc .
```

<img src="https://s2.loli.net/2022/04/08/QJoiqIPwBV3jg6b.png" style="zoom:90%;" />

The quality becomes higher!!! :v: :v: :v:
