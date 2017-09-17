

#expects $token to be defined via circle 


# list artifacts of latest build into 
# looks like:
#
#  [ 
#   {
#    "path" : "tmp/artifacts/automate_ui.tar.gz",
#    "pretty_path" : "tmp/artifacts/automate_ui.tar.gz",
#    "node_index" : 0,
#    "url" : "x.automate.tar.gz"
#   }]

if [ -z ${token+x} ]; 
	then 
	  echo "token not set, critical  error, exiting" && echo "token: $token" && exit 1;

else 
	echo "token: is set to : $token"; 
fi;

curl -o artifact_list.txt "https://circleci.com/api/v1.1/project/github/BradfordMedeiros/automate_ui2/latest/artifacts?circle-token=$token&branch=master" 

jq .[0].url artifact_list.txt -r > latest_url


# then download the actual file

artifact_url=$(cat latest_url)
echo url is $artifact_url
echo "$artifact_url&token=$token"
curl "$artifact_url" > automate_ui.tar.gz

#unzip the tar, creates ./build folder

tar -xvf automate_ui.tar.gz

# and copy that into the public folder
cp -r ./build/* ../public


#clean up our mess
rm artifact_list.txt
rm latest_url
rm -rf ./build/
rm automate_ui.tar.gz




