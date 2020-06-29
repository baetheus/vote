curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"ballot_title":"My Ballot", "candidates":[{"candidate_name":"Brandon"},{"candidate_name":"Brian"}]}' \
  http://localhost:8000/ballot
