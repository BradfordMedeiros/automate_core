wemo switch Wemo0 on
echo '"on"' > ../states/light_state.state.json
mqtt -publish -t light_state -m "on"
echo '"ok"'
