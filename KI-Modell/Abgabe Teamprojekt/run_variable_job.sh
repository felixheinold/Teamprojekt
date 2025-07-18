#!/bin/bash
#SBATCH --job-name="Teamprojekt_cluster_bsp"
#SBATCH --output=QandA.out
#SBATCH --export=ALL
#SBATCH --error=QandA.err
#SBATCH --partition=cpu
#SBATCH --nodes=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=4000mb
#SBATCH --time=00:20:00
#SBATCH --mail-user=uutnq@student.kit.edu
#SBATCH --mail-type=BEGIN,END,FAIL
export GOOGLE_APPLICATION_CREDENTIALS="/pfs/work9/.../cluster-gcs-uploader-key.json"

pdf_datei="$1"
kapitel="$4"
kapitelnummer="${kapitel##* }"
modul="$2"
modulkuerzel=$(echo "${modul:0:2}" | tr '[:upper:]' '[:lower:]')
vorlesung="$3"
vl=$(echo "${vorlesung:0:2}" | tr '[:upper:]' '[:lower:]')

export PYTHONPATH=$HOME/.local/lib/python3.13/site-packages:$PYTHONPATH
module load devel/python/3.13.3-gnu-11.4
python3 quiz.py "$pdf_datei" "$kapitel" "$kapitelnummer" "$modul" "$modulkuerzel" "$vorlesung" "$vl" 