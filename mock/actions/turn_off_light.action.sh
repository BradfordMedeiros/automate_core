wemo switch Wemo0 off
echo '"off"' > ../states/light_state.state.json
mqtt -publish -t light_state -m "off"
echo '"ok"'
