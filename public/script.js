// // Fetch and display standings
// async function loadStandings(leagueId) {
//   const standingsContainer = document.getElementById('standingsContainer');
//   standingsContainer.innerHTML = '<div class="loading">Loading standings...</div>';

//   try {
//     const res = await fetch(`/api/standings/${leagueId}`);
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const teams = await res.json();

//     if (!teams || teams.length === 0) {
//       standingsContainer.innerHTML = '<p class="no-data">No teams found for this league.</p>';
//       return;
//     }

//     const table = createStandingsTable(teams);
//     standingsContainer.innerHTML = table;
//   } catch (error) {
//     console.error('Standings load error:', error);
//     standingsContainer.innerHTML = `<p class="error">Error loading standings: ${error.message}</p>`;
//   }
// }

// // Create standings table HTML
// function createStandingsTable(teams) {
//   // Sort teams by points (descending), then goal difference (descending)
//   teams.sort((a, b) => {
//     if (b.points !== a.points) return b.points - a.points;
//     return (b.goals_for - b.goals_against) - (a.goals_for - a.goals_against);
//   });

//   let html = `
//     <table class="standings-table">
//       <thead>
//         <tr>
//           <th>Pos</th>
//           <th>Team</th>
//           <th>P</th>
//           <th>W</th>
//           <th>D</th>
//           <th>L</th>
//           <th>GF</th>
//           <th>GA</th>
//           <th>GD</th>
//           <th>Pts</th>
//         </tr>
//       </thead>
//       <tbody>
//   `;
  
//   teams.forEach((team, index) => {
//     const goalDifference = team.goals_for - team.goals_against;
//     html += `
//       <tr>
//         <td>${index + 1}</td>
//         <td class="team-name">${team.name}</td>
//         <td>${team.played}</td>
//         <td>${team.won}</td>
//         <td>${team.draw}</td>
//         <td>${team.lost}</td>
//         <td>${team.goals_for}</td>
//         <td>${team.goals_against}</td>
//         <td>${goalDifference}</td>
//         <td class="points">${team.points}</td>
//       </tr>
//     `;
//   });

//   html += '</tbody></table>';
//   return html;
// }

// // Fetch and display teams with enhanced error handling
// async function fetchTeams(leagueId) {
//   if (!leagueId) {
//     showAlert("Please enter a valid League ID", "error");
//     return;
//   }

//   const list = document.getElementById('teamList');
//   list.innerHTML = '<li class="loading">Loading teams...</li>';

//   try {
//     const res = await fetch(`/api/teams/${leagueId}`);
    
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const teams = await res.json();
//     list.innerHTML = "";

//     if (!teams || teams.length === 0) {
//       list.innerHTML = '<li class="no-data">No teams found for this league.</li>';
//       return;
//     }

//     teams.forEach(team => {
//       const li = document.createElement('li');
//       li.className = 'team-item';
//       li.innerHTML = `
//         <span class="team-name">${team.name}</span>
//         <span class="team-id">ID: ${team.id}</span>
//       `;
//       list.appendChild(li);
//     });
//   } catch (err) {
//     console.error('Team load error:', err);
//     list.innerHTML = `<li class="error">Error loading teams: ${err.message}</li>`;
//   }
// }

// // Add a team with improved validation
// async function addTeam(e) {
//   e.preventDefault();
  
//   const name = document.getElementById('teamName').value.trim();
//   const leagueId = document.getElementById('leagueIdInput').value.trim();

//   if (!name || !leagueId) {
//     showAlert("Please fill all required fields", "error");
//     return;
//   }

//   try {
//     const res = await fetch('/api/teams', {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//         name, 
//         league_id: parseInt(leagueId) 
//       })
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || 'Failed to add team');
//     }

//     showAlert(data.message || "Team added successfully", "success");
//     document.getElementById('teamForm').reset();
//     fetchTeams(leagueId);
//   } catch (err) {
//     console.error('Team add error:', err);
//     showAlert(err.message || "Failed to add team", "error");
//   }
// }

// // Record a match with comprehensive validation
// async function recordMatch(e) {
//   e.preventDefault();

//   const leagueId = document.getElementById('matchLeagueId').value.trim();
//   const homeTeamId = document.getElementById('homeTeamId').value.trim();
//   const awayTeamId = document.getElementById('awayTeamId').value.trim();
//   const homeGoals = parseInt(document.getElementById('homeGoals').value);
//   const awayGoals = parseInt(document.getElementById('awayGoals').value);

//   // Validation
//   if (!leagueId || !homeTeamId || !awayTeamId || isNaN(homeGoals) || isNaN(awayGoals)) {
//     showAlert("Please fill all fields with valid values", "error");
//     return;
//   }

//   if (homeTeamId === awayTeamId) {
//     showAlert("Home and away teams cannot be the same", "error");
//     return;
//   }

//   if (homeGoals < 0 || awayGoals < 0) {
//     showAlert("Goals cannot be negative", "error");
//     return;
//   }

//   try {
//     const res = await fetch('/api/matches', {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         league_id: parseInt(leagueId),
//         home_team_id: parseInt(homeTeamId),
//         away_team_id: parseInt(awayTeamId),
//         home_goals: homeGoals,
//         away_goals: awayGoals,
//         match_date: new Date().toISOString().split('T')[0] // Current date as default
//       })
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || 'Failed to record match');
//     }

//     showAlert(data.message || "Match recorded successfully", "success");
//     document.getElementById('matchForm').reset();
    
//     // Refresh standings if on that page
//     if (document.getElementById('standingsContainer')) {
//       loadStandings(leagueId);
//     }
//   } catch (err) {
//     console.error('Match record error:', err);
//     showAlert(err.message || "Failed to record match", "error");
//   }
// }

// // Improved match form submission handler
// document.getElementById('matchForm')?.addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const leagueId = document.getElementById('leagueId').value.trim();
//   const homeTeamId = document.getElementById('homeTeamId').value.trim();
//   const awayTeamId = document.getElementById('awayTeamId').value.trim();
//   const homeGoals = document.getElementById('homeGoals').value.trim();
//   const awayGoals = document.getElementById('awayGoals').value.trim();
//   const responseMessage = document.getElementById('responseMessage');

//   // Clear previous messages
//   responseMessage.textContent = '';
//   responseMessage.className = '';

//   // Validate inputs
//   if (!leagueId || !homeTeamId || !awayTeamId || !homeGoals || !awayGoals) {
//     responseMessage.textContent = 'Please fill all fields';
//     responseMessage.className = 'error';
//     return;
//   }

//   if (homeTeamId === awayTeamId) {
//     responseMessage.textContent = 'Home and away teams must be different';
//     responseMessage.className = 'error';
//     return;
//   }

//   try {
//     const res = await fetch('/api/matches', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         leagueId: parseInt(leagueId),
//         homeTeamId: parseInt(homeTeamId),
//         awayTeamId: parseInt(awayTeamId),
//         homeGoals: parseInt(homeGoals),
//         awayGoals: parseInt(awayGoals),
//         matchDate: new Date().toISOString().split('T')[0]
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       responseMessage.textContent = data.message || 'Match recorded successfully';
//       responseMessage.className = 'success';
//       this.reset();
      
//       // Refresh related data
//       if (document.getElementById('standingsContainer')) {
//         loadStandings(leagueId);
//       }
//     } else {
//       throw new Error(data.message || 'Failed to record match');
//     }
//   } catch (error) {
//     console.error('Match submission error:', error);
//     responseMessage.textContent = error.message || 'Network error, please try again.';
//     responseMessage.className = 'error';
//   }
// });

// // Enhanced team dropdown population
// async function populateTeamDropdown(leagueId) {
//   const dropdown = document.getElementById('teamDropdown');
//   if (!dropdown) return;

//   dropdown.innerHTML = '<option value="" disabled selected>Loading teams...</option>';
//   dropdown.disabled = true;

//   try {
//     const res = await fetch(`/api/teams/${leagueId}`);
    
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const teams = await res.json();
//     dropdown.innerHTML = '<option value="" disabled selected>Select Team</option>';

//     if (!teams || teams.length === 0) {
//       dropdown.innerHTML = '<option value="" disabled>No teams available</option>';
//       return;
//     }

//     teams.forEach(team => {
//       const option = document.createElement('option');
//       option.value = team.id;
//       option.textContent = team.name;
//       dropdown.appendChild(option);
//     });
    
//     dropdown.disabled = false;
//   } catch (err) {
//     console.error('Dropdown load error:', err);
//     dropdown.innerHTML = '<option value="" disabled>Error loading teams</option>';
//   }
// }

// // Helper function for displaying alerts
// function showAlert(message, type = 'info') {
//   const alertDiv = document.createElement('div');
//   alertDiv.className = `alert ${type}`;
//   alertDiv.textContent = message;
  
//   document.body.appendChild(alertDiv);
  
//   setTimeout(() => {
//     alertDiv.remove();
//   }, 5000);
// }

// // Initialize on DOM load
// document.addEventListener('DOMContentLoaded', () => {
//   // Initialize any league ID inputs
//   const leagueInputs = document.querySelectorAll('[data-league-id]');
//   leagueInputs.forEach(input => {
//     const leagueId = input.dataset.leagueId;
//     if (leagueId) {
//       if (input.id === 'standingsLeagueId') {
//         loadStandings(leagueId);
//       }
//       fetchTeams(leagueId);
//     }
//   });

//   // Set up form event listeners
//   document.getElementById('teamForm')?.addEventListener('submit', addTeam);
//   document.getElementById('standingsLeagueId')?.addEventListener('change', (e) => {
//     const leagueId = e.target.value;
//     if (leagueId) {
//       populateTeamDropdown(leagueId);
//       loadStandings(leagueId);
//     }
//   });
// });