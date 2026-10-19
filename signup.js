(function () {
  var SUPABASE_URL = 'https://qnarhtydsvxafdrmjqil.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_UhtJIjMTsegrgHNaUKYcRg_e-FV60cd';

  /* A `?s=` on the URL names the signup source (ig-bio, ig-story, ig-dm)
     so Instagram signups stop being indistinguishable from everything
     else. Strict shape, matching the column's CHECK; anything else falls
     back to 'landing'. Data hygiene, not security: the RPC is public and
     always could be called with any string. */
  var source = 'landing';
  try {
    var s = new URLSearchParams(location.search).get('s');
    if (s && /^[a-z0-9-]{1,40}$/.test(s)) source = s;
  } catch (err) { /* very old browser: keep 'landing' */ }

  /* The school list. Florida leads because that is the launch market; the
     rest is grouped by state so a 199-entry dropdown stays scannable instead
     of becoming one endless scroll. Built here rather than written into the
     markup twice, so the hero form and the closing form cannot drift apart --
     and the form already needs JavaScript to submit at all, so this costs no
     one a working page. A school that is missing shows up in the data as
     'Other (not listed)', which is the cue to add rows here. */
  var COLLEGES = [
    ['Florida', [
      'University of Florida', 'Florida State University', 'University of Central Florida',
      'University of South Florida', 'Florida International University',
      'Florida Atlantic University', 'Florida A&M University', 'University of North Florida',
      'University of West Florida', 'Florida Gulf Coast University',
      'Florida Polytechnic University', 'New College of Florida', 'University of Miami',
      'University of Tampa',
      'Nova Southeastern University', 'Stetson University', 'Rollins College',
      'Embry-Riddle Aeronautical University', 'Florida Institute of Technology',
      'Jacksonville University', 'Barry University', 'Lynn University',
      'Palm Beach Atlantic University', 'Flagler College', 'Eckerd College',
      'Saint Leo University', 'Bethune-Cookman University', 'Miami Dade College',
      'Valencia College', 'Broward College', 'Hillsborough Community College',
      'Santa Fe College', 'St. Petersburg College', 'Seminole State College of Florida',
      'Tallahassee State College'
    ]],
    ['Alabama', [
      'University of Alabama', 'Auburn University', 'University of Alabama at Birmingham'
    ]],
    ['Alaska', [
      'University of Alaska Anchorage'
    ]],
    ['Arizona', [
      'Arizona State University', 'University of Arizona', 'Northern Arizona University'
    ]],
    ['Arkansas', [
      'University of Arkansas'
    ]],
    ['California', [
      'University of California, Los Angeles', 'University of California, Berkeley',
      'University of California, San Diego', 'University of California, Davis',
      'University of California, Irvine', 'University of California, Santa Barbara',
      'University of Southern California', 'Stanford University', 'San Diego State University',
      'San Jose State University', 'California State University, Long Beach',
      'California Polytechnic State University, San Luis Obispo'
    ]],
    ['Colorado', [
      'University of Colorado Boulder', 'Colorado State University', 'University of Denver'
    ]],
    ['Connecticut', [
      'University of Connecticut', 'Yale University'
    ]],
    ['Delaware', [
      'University of Delaware'
    ]],
    ['District of Columbia', [
      'George Washington University', 'Georgetown University', 'Howard University'
    ]],
    ['Georgia', [
      'University of Georgia', 'Georgia Institute of Technology', 'Georgia State University',
      'Kennesaw State University', 'Emory University'
    ]],
    ['Hawaii', [
      'University of Hawaii at Manoa'
    ]],
    ['Idaho', [
      'Boise State University'
    ]],
    ['Illinois', [
      'University of Illinois Urbana-Champaign', 'University of Illinois Chicago',
      'Northwestern University', 'University of Chicago', 'DePaul University'
    ]],
    ['Indiana', [
      'Indiana University Bloomington', 'Purdue University', 'University of Notre Dame',
      'Ball State University'
    ]],
    ['Iowa', [
      'University of Iowa', 'Iowa State University'
    ]],
    ['Kansas', [
      'University of Kansas', 'Kansas State University'
    ]],
    ['Kentucky', [
      'University of Kentucky', 'University of Louisville'
    ]],
    ['Louisiana', [
      'Louisiana State University', 'Tulane University'
    ]],
    ['Maine', [
      'University of Maine'
    ]],
    ['Maryland', [
      'University of Maryland, College Park', 'Johns Hopkins University', 'Towson University'
    ]],
    ['Massachusetts', [
      'Boston University', 'Northeastern University', 'University of Massachusetts Amherst',
      'Harvard University', 'Massachusetts Institute of Technology', 'Boston College'
    ]],
    ['Michigan', [
      'University of Michigan', 'Michigan State University', 'Wayne State University',
      'Western Michigan University', 'Grand Valley State University'
    ]],
    ['Minnesota', [
      'University of Minnesota Twin Cities', 'Minnesota State University, Mankato'
    ]],
    ['Mississippi', [
      'University of Mississippi', 'Mississippi State University'
    ]],
    ['Missouri', [
      'University of Missouri', 'Missouri State University', 'Saint Louis University',
      'Washington University in St. Louis'
    ]],
    ['Montana', [
      'Montana State University'
    ]],
    ['Nebraska', [
      'University of Nebraska-Lincoln'
    ]],
    ['Nevada', [
      'University of Nevada, Las Vegas', 'University of Nevada, Reno'
    ]],
    ['New Hampshire', [
      'University of New Hampshire', 'Dartmouth College'
    ]],
    ['New Jersey', [
      'Rutgers University-New Brunswick', 'Princeton University', 'Montclair State University',
      'Rowan University'
    ]],
    ['New Mexico', [
      'University of New Mexico'
    ]],
    ['New York', [
      'New York University', 'Columbia University', 'Cornell University', 'Syracuse University',
      'Fordham University', 'University at Buffalo', 'Stony Brook University',
      'Binghamton University', 'Rochester Institute of Technology', 'Hunter College, CUNY',
      'Baruch College, CUNY'
    ]],
    ['North Carolina', [
      'University of North Carolina at Chapel Hill', 'North Carolina State University',
      'Duke University', 'University of North Carolina at Charlotte',
      'East Carolina University', 'Appalachian State University'
    ]],
    ['North Dakota', [
      'North Dakota State University'
    ]],
    ['Ohio', [
      'The Ohio State University', 'University of Cincinnati', 'Kent State University',
      'Ohio University', 'Miami University', 'Bowling Green State University',
      'Case Western Reserve University'
    ]],
    ['Oklahoma', [
      'University of Oklahoma', 'Oklahoma State University'
    ]],
    ['Oregon', [
      'University of Oregon', 'Oregon State University', 'Portland State University'
    ]],
    ['Pennsylvania', [
      'Pennsylvania State University', 'University of Pittsburgh', 'Temple University',
      'Drexel University', 'University of Pennsylvania', 'Carnegie Mellon University'
    ]],
    ['Rhode Island', [
      'University of Rhode Island', 'Brown University'
    ]],
    ['South Carolina', [
      'University of South Carolina', 'Clemson University', 'College of Charleston'
    ]],
    ['South Dakota', [
      'South Dakota State University'
    ]],
    ['Tennessee', [
      'University of Tennessee, Knoxville', 'Middle Tennessee State University',
      'University of Memphis', 'Vanderbilt University'
    ]],
    ['Texas', [
      'The University of Texas at Austin', 'Texas A&M University', 'University of Houston',
      'Texas Tech University', 'University of North Texas', 'Texas State University',
      'The University of Texas at Arlington', 'The University of Texas at San Antonio',
      'The University of Texas at Dallas', 'Baylor University', 'Rice University'
    ]],
    ['Utah', [
      'University of Utah', 'Utah State University', 'Brigham Young University',
      'Utah Valley University'
    ]],
    ['Vermont', [
      'University of Vermont'
    ]],
    ['Virginia', [
      'Virginia Tech', 'University of Virginia', 'George Mason University',
      'Virginia Commonwealth University', 'James Madison University', 'Old Dominion University',
      'Roanoke College'
    ]],
    ['Washington', [
      'University of Washington', 'Washington State University',
      'Western Washington University', 'Seattle University'
    ]],
    ['West Virginia', [
      'West Virginia University', 'Marshall University'
    ]],
    ['Wisconsin', [
      'University of Wisconsin-Madison', 'University of Wisconsin-Milwaukee',
      'Marquette University'
    ]],
    ['Wyoming', [
      'University of Wyoming'
    ]],
  ];

  /* ---- The college combobox -------------------------------------------
     A search field over COLLEGES rather than a <select>. Three things it has
     to get right:

       1. Typing filters ~200 schools so nobody scrolls. Matching ignores
          case and punctuation and understands acronyms and a few nicknames,
          so "ucf", "texas a&m" and "bama" all land on the right school.
       2. Anything NOT on the list is still submittable. The last row is an
          escape hatch that keeps what was typed and sends it as
          `Other: <typed>` -- marked as off-list, but BY NAME, so the list can
          be extended from real demand instead of guesses.
       3. It stays optional. Empty box, null value, signup proceeds.

     The resolved value lives in `data-value` on the input rather than in the
     visible text, so the canonical school name is what gets stored even when
     someone typed a nickname and picked from the list. */

  var OTHER_PREFIX = 'Other: ';

  /* Words that carry no signal in an acronym: "University of Central Florida"
     has to reduce to UCF, not UOCF. */
  var STOP = {of: 1, the: 1, at: 1, and: 1, in: 1, for: 1};

  /* Nicknames the initials rule cannot reach. Deliberately short -- the
     acronym rule below already covers UF, FSU, UCF, USF, FIU, FAU, FAMU,
     UCLA, NYU, MIT, LSU, BYU, RIT and the rest. Only genuine misses go here. */
  var ALIASES = {
    'University of Georgia': 'uga',
    'Georgia Institute of Technology': 'georgia tech gt',
    'University of Mississippi': 'ole miss',
    'University of California, Berkeley': 'cal berkeley',
    'Pennsylvania State University': 'penn state psu',
    'University of Pittsburgh': 'pitt',
    'University of Missouri': 'mizzou',
    'University of Alabama': 'bama roll tide',
    'Syracuse University': 'cuse',
    'University of North Carolina at Chapel Hill': 'unc tar heels',
    'Texas A&M University': 'tamu',
    'University of Notre Dame': 'nd',
    'College of William & Mary': 'wm',
    'Virginia Tech': 'vt',
    'The Ohio State University': 'osu'
  };

  function norm(v) {
    return String(v).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  /* Flattened once into {name, state, hay, acr, alias} so filtering is a
     single pass over precomputed strings rather than re-normalising 199
     names on every keystroke. */
  var SCHOOLS = [];
  for (var ci = 0; ci < COLLEGES.length; ci++) {
    for (var cj = 0; cj < COLLEGES[ci][1].length; cj++) {
      var nm = COLLEGES[ci][1][cj];
      var words = norm(nm).split(' ');
      var acr = '';
      for (var w = 0; w < words.length; w++) {
        if (!STOP[words[w]]) acr += words[w].charAt(0);
      }
      SCHOOLS.push({
        name: nm,
        state: COLLEGES[ci][0],
        hay: norm(nm) + ' ' + norm(COLLEGES[ci][0]),
        acr: acr,
        alias: ALIASES[nm] ? norm(ALIASES[nm]) : ''
      });
    }
  }

  /* Ranked, best tier first:
       0. the acronym IS what was typed              ("ucf"  -> U of Central FL)
       1. the name starts with what was typed        ("flor" -> Florida State)
       2. a nickname matches                         ("bama" -> U of Alabama)
       3. a word inside the name starts with it      ("miami"-> U of Miami)
       4. the acronym starts with it                 ("unc"  -> UNC Charlotte)
       5. it appears anywhere, state included        ("ohio" -> Kent State)
     An exact acronym outranks a name that merely begins with the same
     letters: "ut" means University of Tampa, not the three Utah schools whose
     names happen to start u-t. Whole-string acronym equality is specific
     enough to trust over a prefix.
     List order is preserved inside every tier, so Florida stays on top. */
  function search(q) {
    var n = norm(q);
    if (!n) return null;
    var squashed = n.replace(/ /g, '');
    var tiers = [[], [], [], [], [], []];
    for (var i = 0; i < SCHOOLS.length; i++) {
      var sc = SCHOOLS[i];
      var name = norm(sc.name);
      var at = name.indexOf(n);
      if (sc.acr === squashed) tiers[0].push(sc);
      else if (at === 0) tiers[1].push(sc);
      else if (sc.alias && (sc.alias + ' ').indexOf(n + ' ') > -1) tiers[2].push(sc);
      else if (at > 0 && name.charAt(at - 1) === ' ') tiers[3].push(sc);
      else if (squashed.length > 1 && sc.acr.indexOf(squashed) === 0) tiers[4].push(sc);
      else if (at > 0 || sc.hay.indexOf(n) > -1) tiers[5].push(sc);
    }
    return tiers[0].concat(tiers[1], tiers[2], tiers[3], tiers[4], tiers[5]);
  }

  function wireCombo(form, prefix) {
    var input = form.querySelector('.combo-input');
    var list = form.querySelector('.combo-list');
    if (!input || !list) return null;

    var open = false, active = -1, rows = [];

    function setValue(v) { input.setAttribute('data-value', v || ''); }
    setValue('');

    function close() {
      if (!open) return;
      open = false; active = -1;
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function highlight(i) {
      if (active > -1 && rows[active]) rows[active].el.classList.remove('on');
      active = i;
      if (active < 0 || !rows[active]) { input.removeAttribute('aria-activedescendant'); return; }
      var el = rows[active].el;
      el.classList.add('on');
      input.setAttribute('aria-activedescendant', el.id);
      /* Scroll the row into view inside the list, never the page. */
      var top = el.offsetTop, bottom = top + el.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    }

    function choose(i) {
      if (!rows[i]) return;
      input.value = rows[i].text;
      setValue(rows[i].value);
      close();
    }

    /* `text` is what the box shows once the row is chosen. It differs from the
       visible label only for the escape hatch, which reads 'Use "X"' but must
       leave plain 'X' behind rather than the instruction. */
    function row(label, value, secondary, kind, text) {
      var li = document.createElement('li');
      var entry = {el: li, label: label, value: value, text: text || label};
      li.id = prefix + '-opt-' + rows.length;
      li.className = 'combo-opt' + (kind ? ' combo-opt--' + kind : '');
      li.setAttribute('role', 'option');
      var main = document.createElement('span');
      main.className = 'combo-opt-name';
      main.textContent = label;
      li.appendChild(main);
      if (secondary) {
        var sec = document.createElement('span');
        sec.className = 'combo-opt-where';
        sec.textContent = secondary;
        li.appendChild(sec);
      }
      /* mousedown, not click: click lands after blur, which has already
         closed the list and discarded the row. */
      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        choose(rows.indexOf(entry));
      });
      rows.push(entry);
      list.appendChild(li);
    }

    /* Both signup sections set `overflow: hidden` for their ambient glow, so
       the list is clipped at the section edge rather than floating over it.
       At 320px the closing form had only enough room for 261px of a 264px
       list and lost the last row. Rather than guess, measure the clipping box
       and fit inside it -- shrinking when there is room to be useful, and
       flipping above the field when there genuinely is not. */
    function clipBox() {
      var el = list.parentElement;
      while (el && el !== document.body) {
        var cs = getComputedStyle(el);
        if ((cs.overflow + cs.overflowX + cs.overflowY).indexOf('visible') === -1) {
          return el.getBoundingClientRect();
        }
        el = el.parentElement;
      }
      return {top: 0, bottom: window.innerHeight};
    }

    var GAP = 6, MIN_H = 160, MAX_H = 264;

    function place() {
      list.style.top = '';
      list.style.bottom = '';
      list.style.maxHeight = '';
      var box = clipBox();
      var ir = input.getBoundingClientRect();
      var below = box.bottom - ir.bottom - GAP;
      var above = ir.top - box.top - GAP;
      if (below >= MIN_H || below >= above) {
        list.style.maxHeight = Math.max(MIN_H, Math.min(MAX_H, below)) + 'px';
      } else {
        list.style.top = 'auto';
        list.style.bottom = 'calc(100% + ' + GAP + 'px)';
        list.style.maxHeight = Math.max(MIN_H, Math.min(MAX_H, above)) + 'px';
      }
    }

    function groupHeading(text) {
      var li = document.createElement('li');
      li.className = 'combo-group';
      li.setAttribute('role', 'presentation');
      li.textContent = text;
      list.appendChild(li);
    }

    function render() {
      rows = []; active = -1;
      list.textContent = '';
      var typed = input.value.trim();
      var hits = search(typed);

      if (hits === null) {
        /* Nothing typed: browse the lot, grouped by state, Florida first. */
        for (var i = 0; i < COLLEGES.length; i++) {
          groupHeading(COLLEGES[i][0]);
          for (var j = 0; j < COLLEGES[i][1].length; j++) {
            row(COLLEGES[i][1][j], COLLEGES[i][1][j]);
          }
        }
      } else {
        for (var k = 0; k < hits.length; k++) row(hits[k].name, hits[k].name, hits[k].state);
        var exact = false;
        for (var m = 0; m < hits.length; m++) {
          if (norm(hits[m].name) === norm(typed)) { exact = true; break; }
        }
        if (!exact) {
          row('Use \u201C' + typed + '\u201D', OTHER_PREFIX + typed,
              hits.length ? 'not listed' : 'add it anyway', 'other', typed);
        }
      }

      if (!rows.length) { close(); return; }
      list.scrollTop = 0;
      list.hidden = false;
      place();          /* after unhiding: a hidden element has no rect */
      open = true;
      input.setAttribute('aria-expanded', 'true');
    }

    input.addEventListener('focus', render);
    input.addEventListener('input', function () {
      /* Typing invalidates a previous pick; submit re-resolves, so a full
         name typed by hand still counts as that school. */
      setValue('');
      render();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open) { render(); if (!open) return; }
        var next = e.key === 'ArrowDown' ? active + 1 : active - 1;
        if (next < 0) next = rows.length - 1;
        if (next >= rows.length) next = 0;
        highlight(next);
      } else if (e.key === 'Enter') {
        /* Enter picks the highlighted row; otherwise it falls through and
           submits the form, which is what someone typing fast expects. */
        if (open && active > -1) { e.preventDefault(); choose(active); }
        else close();
      } else if (e.key === 'Escape') {
        if (open) { e.stopPropagation(); close(); }
      } else if (e.key === 'Tab') {
        close();
      }
    });

    input.addEventListener('blur', close);

    /* What actually gets stored. Called on submit, so a name typed in full
       and never picked from the list still resolves to the listed school. */
    function resolve() {
      var picked = input.getAttribute('data-value');
      if (picked) return picked;
      var typed = input.value.trim();
      if (!typed) return null;
      for (var i = 0; i < SCHOOLS.length; i++) {
        if (norm(SCHOOLS[i].name) === norm(typed)) return SCHOOLS[i].name;
      }
      return OTHER_PREFIX + typed;
    }

    return {resolve: resolve, reset: function () { input.value = ''; setValue(''); close(); }};
  }

  function looksLikeEmail(v) {
    var at = v.indexOf('@');
    return at > 0 && v.indexOf('.', at) > at + 1 && !/\s/.test(v);
  }

  function wire(form) {
    if (!form) return;
    var email = form.querySelector('input[type="email"]');
    var honey = form.querySelector('input[name="company"]');
    var school = wireCombo(form, form.id.replace('signup-', ''));
    var button = form.querySelector('button');
    var msg = form.querySelector('.signup-msg');

    function say(text, kind) {
      msg.textContent = text;
      msg.className = 'signup-msg' + (kind ? ' ' + kind : '');
    }
    function invalid(state) {
      if (state) email.setAttribute('aria-invalid', 'true');
      else email.removeAttribute('aria-invalid');
    }

    /* Validate on blur, not on every keystroke: telling someone their
       address is wrong while they are still typing it is noise. */
    email.addEventListener('blur', function () {
      var v = email.value.trim();
      if (!v) { invalid(false); return; }
      if (!looksLikeEmail(v)) {
        invalid(true);
        say("That doesn't look like an email address.", 'err');
      } else {
        invalid(false);
        if (msg.classList.contains('err')) say('');
      }
    });
    email.addEventListener('input', function () {
      if (email.getAttribute('aria-invalid') && looksLikeEmail(email.value.trim())) {
        invalid(false);
        say('');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = (email.value || '').trim();

      // Bot filled the hidden field: show success, save nothing.
      if (honey && honey.value) { say("You're on the list.", 'ok'); return; }

      if (!looksLikeEmail(value)) {
        invalid(true);
        say("That doesn't look like an email address.", 'err');
        email.focus();
        return;
      }

      invalid(false);
      button.disabled = true;
      say('Adding you...');

      fetch(SUPABASE_URL + '/rest/v1/rpc/join_waitlist', {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p_email: value,
          p_source: source,
          /* Optional: an untouched box sends null. A school that is not on
             the list arrives as 'Other: <what they typed>'. */
          p_college: school ? school.resolve() : null
        })
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          if (school) school.reset();
          say("You're on the list. We'll email you as it progresses.", 'ok');
        } else if (res.status === 400) {
          invalid(true);
          say("That doesn't look like an email address.", 'err');
        } else {
          say('Something went wrong. Try again, or email us instead.', 'err');
        }
      }).catch(function () {
        say('Could not reach the server. Check your connection and try again.', 'err');
      }).then(function () {
        button.disabled = false;
      });
    });
  }

  wire(document.getElementById('signup-hero'));
  wire(document.getElementById('signup-closing'));
})();
