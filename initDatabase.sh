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

sudo su postgres
psql -U postgres -c "CREATE ROLE ubuntu;"
psql -U postgres -c "ALTER ROLE  ubuntu  WITH LOGIN;"
psql -U postgres -c "ALTER USER  ubuntu  CREATEDB;"
psql -U postgres -c "ALTER USER  ubuntu  WITH PASSWORD 'ubuntu';"
psql -U postgres -c "ALTER USER  ubuntu  SUPERUSER"
exit

# # bind 5432 to the public IP so we can access it from outside the machine
# # first find the config file
# sudo find / -name "postgresql.conf"
# sudo nano /etc/postgresql/12/main/postgresql.conf
# # edit the config file to allow listen addresses beyond localhost by adding/modifying this line:
# listen_addresses = '*'
# # find the hba conf
# sudo find / -name "pg_hba.conf"
# sudo nano /etc/postgresql/12/main/pg_hba.conf
# # add these 2 lines to the end of that file
# host    all             all              0.0.0.0/0                       md5
# host    all             all              ::/0                            md5

# # restart the server
# sudo systemctl restart postgresql

createdb qa
psql -d qa -f schema.sql