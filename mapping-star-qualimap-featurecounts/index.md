# 3. Mapping (STAR+Qualimap+featureCounts)

{{< admonition type=summary title="Summary" open=false >}}
In this section, we are going to map the read files to genome index using STAR, perform QC with Qualimap, and obtain count data using featureCounts.
{{< /admonition >}}

## 1. installation of STAR 

> Pl ease refer to this official [manual](https://physiology.med.cornell.edu/faculty/skrabanek/lab/angsd/lecture_notes/STARmanual.pdf)

```shell
# Get latest STAR source from releases
wget https://github.com/alexdobin/STAR/archive/2.7.9a.tar.gz
tar -xzf 2.7.9a.tar.gz
cd STAR-2.7.9a
# Compile under Linux
cd /STAR-2.7.9a/source
make STAR
 
#test
STAR
```

## 2. Generation of genome index

For mapping, the first step that needs to be done is the generation of the genome index. 

Here, I used the data from [Genecode](https://www.gencodegenes.org/). As I used mouse samples for RNA-seq analysis, I generated mouse genome index this time. 

![gtf](https://s2.loli.net/2022/04/11/gGtLYrNR1af7jxW.jpg)

![sequence](https://s2.loli.net/2022/04/11/FQuNf3YORy9zMp4.jpg)

```shell
#create a new folder named as index
mkdir /home/xxx/reference/index
#running STAR for the generation of index
STAR --runThreadN 10 
--runMode genomeGenerate 
--genomeDir index/ 
--genomeFastaFiles GRCh38.p13.genome.fa  
--sjdbGTFfile gencode.v38.annotation.gtf 
--sjdbOverhang 35
```

## 3. Running Mapping using two-pass-mode 

```shell
STAR --runThreadN 10
--runMode alignReads 
--readFilesCommand zcat 
--twopassMode Basic 
--outSAMtype BAM SortedByCoordinate 
--genomeDir /reference/genome/grcm39/index/ 
--readFilesIn 2_R1_val_1.fq.gz  2_R2_val_2.fq.gz 
--outFileNamePrefix /wkdir/WT2Brain
```

one sample takes about 6 minutes

```shell
Dec 07 18:03:31 ..... started STAR run
Dec 07 18:03:31 ..... loading genome
Dec 07 18:05:35 ..... started 1st pass mapping
Dec 07 18:07:22 ..... finished 1st pass mapping
Dec 07 18:07:22 ..... inserting junctions into the genome indices
Dec 07 18:08:19 ..... started mapping
Dec 07 18:10:16 ..... finished mapping
Dec 07 18:10:18 ..... started sorting BAM
Dec 07 18:11:13 ..... finished successfully
```

The log file provides information on reads that 1) mapped uniquely, 2) reads that mapped to mutliple locations and 3) reads that are unmapped. Additionally, we get details on splicing, insertion and deletion. From this file the most informative statistics include the **mapping rate and the number of multimappers**.

## 4. QC of mapping using Qualimap

In addition to the aligner-specific summary, we can also obtain quality metrics using tools like [Qualimap](http://qualimap.bioinfo.cipf.es/doc_html/intro.html#what-is-qualimap), a Java application that aims to facilitate the quality-control analysis of mapping data.

```shell
~/Desktop/qualimap_v2.2.1/qualimap rnaseq -bam /dir/xxx.bam -gtf /dir/annotation.gtf 
-outdir /dir/WT1 --jav-mem-size=8G
```

Check how many percentages of reads are mapped :

Check how many percentages of the reads are exonic: 



## 5. Obtain counts data using featureCounts

```shell
/home/akif/Downloads/subread-2.0.3-source/bin/featureCounts -s 2 -p -t gene -g gene_id -a /dir/annotation.gtf -o counts.txt *.bam
```



Delete the columns which are not necessary. 

```shell
cut -f1,7-100 ${WORKDIR}/count/count.txt > ${WORKDIR}/count/featurecounts.txt
```

