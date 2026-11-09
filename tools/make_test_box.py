import os

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 240" width="260" height="240">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
    <linearGradient id="k-fl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ab7138"/>
      <stop offset="100%" stop-color="#754417"/>
    </linearGradient>
    <linearGradient id="k-fr" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#cf934e"/>
      <stop offset="100%" stop-color="#9c6427"/>
    </linearGradient>
    <linearGradient id="k-floor" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#42240b"/>
      <stop offset="100%" stop-color="#633914"/>
    </linearGradient>
    <linearGradient id="k-in-l" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2e1504"/>
      <stop offset="100%" stop-color="#452309"/>
    </linearGradient>
    <linearGradient id="k-in-r" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#48260b"/>
      <stop offset="100%" stop-color="#613612"/>
    </linearGradient>
    <linearGradient id="k-f-bl" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#8e5723"/>
      <stop offset="100%" stop-color="#ad743a"/>
    </linearGradient>
    <linearGradient id="k-f-br" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#a66f35"/>
      <stop offset="100%" stop-color="#c98d4d"/>
    </linearGradient>
    <linearGradient id="k-f-fl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b57b3d"/>
      <stop offset="100%" stop-color="#8a521e"/>
    </linearGradient>
    <linearGradient id="k-f-fr" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d89b57"/>
      <stop offset="100%" stop-color="#a86d2f"/>
    </linearGradient>
  </defs>

  <!-- Ground Drop Shadow on light floor -->
  <ellipse cx="130" cy="202" rx="96" ry="26" fill="rgba(20, 14, 8, 0.42)" filter="url(#shadow)"/>

  <!-- Back Flaps (open standing back) -->
  <polygon points="50,90 30,62 114,18 130,45" fill="url(#k-f-bl)" stroke="#dfb27e" stroke-width="0.8"/>
  <polygon points="130,45 146,18 230,62 210,90" fill="url(#k-f-br)" stroke="#dfb27e" stroke-width="0.8"/>

  <!-- Inside Back Walls (Shadowed Cavity) -->
  <polygon points="50,90 130,45 130,105 65,138" fill="url(#k-in-l)"/>
  <polygon points="130,45 210,90 195,138 130,105" fill="url(#k-in-r)"/>

  <!-- Inside Cavity Floor (Where Balls Sit) -->
  <polygon points="130,105 195,138 130,172 65,138" fill="url(#k-floor)"/>

  <!-- Front Outer Faces -->
  <polygon points="50,90 130,135 130,210 50,165" fill="url(#k-fl)"/>
  <polygon points="130,135 210,90 210,165 130,210" fill="url(#k-fr)"/>

  <!-- Front Flaps (Folded Downward-Outward) -->
  <polygon points="50,90 32,122 116,168 130,135" fill="url(#k-f-fl)" stroke="#e5bd8b" stroke-width="0.8"/>
  <polygon points="130,135 144,168 228,122 210,90" fill="url(#k-f-fr)" stroke="#e5bd8b" stroke-width="0.8"/>

  <!-- Packaging Tape Texture along seams -->
  <line x1="130" y1="135" x2="130" y2="210" stroke="rgba(240, 200, 150, 0.25)" stroke-width="2"/>
  <!-- Top Rim Highlight -->
  <polyline points="50,90 130,135 210,90" fill="none" stroke="#fce4c4" stroke-width="1.5" stroke-linecap="round"/>
</svg>'''

with open('test_box.svg', 'w') as f:
    f.write(svg_content)
print('Successfully generated test_box.svg')
