sudo apt update
sudo apt -y upgrade
sudo apt install -y postgresql postgresql-contrib
sudo apt install -y python3-pip
pip3 install gdown
export PATH="/home/ubuntu/.local/bin:$PATH"
git clone https://github.com/Team-Winter/questions-and-answers-api.git
cd questions-and-answers-api/
# download questions.csv from google drive
gdown https://drive.google.com/uc?id=1yvXuqx6gT1ugD3vbVh6_tH8xEGx3Cwlb
# download answers.csv from google drive
gdown https://drive.google.com/uc?id=1xVnfJGxq0If2d3rJI1IUWTC1RLigik1l
# download photos.csv from google drive
gdown https://drive.google.com/uc?id=1bY6hc-b1FbZsHe_Cdhq6wqSK7QBo1h8h

# switch to the postgres account
sudo -i -u postgres

createdb qa
psql -d qa -f schema.sql