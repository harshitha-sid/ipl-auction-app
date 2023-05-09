App = {
  web3: null,
  address: "0x74A49A51e820C06dbB846E8C15e9a01C4A68c765",
  contracts: {"ipl": null},
  accounts: [],
  url: 'http://127.0.0.1:7545',
  network_id: 5777,
  auctioner: null,
  auctionState: null,
  currentAccount: null,

  Player : {
    name: '',
    runs: null,
    wickets: null,
    catches: null,
    baseRate: null,
    highestBid: null,
    tokenId: null,
    highestBidder: null
  },

  Team : {
    name: '',
    owner: null
  },

  players : [],
  teams : [],

  init: function () {
    console.log("Checkpoint 0");
    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3 = new Web3(Web3.givenProvider);
    } else {
      App.web3 = new Web3(App.url);
    }
    ethereum.enable();
    App.populateAddress();
    return App.initContract();
  },

  initContract: async function () {
    let accs = await ethereum.request({method: 'eth_accounts'});
    console.log(accs);
    $.getJSON('../build/contracts/IPLAuction.json', function (data) {
      App.contracts.ipl = new App.web3.eth.Contract(data.abi, App.address, {});
      App.currentAccount = accs[0];
      jQuery('#current_account').text(App.currentAccount);

      // Get my Hello World message from the smart contract
      App.getMyMessage();
      return App.bindEvents();
    });
  },

  populateAddress : function(){  
    new Web3(App.url).eth.getAccounts((err, acc) => {
      App.accounts = acc;
      console.log("In populateAddress, App.accounts: ",App.accounts);
      console.log("In populateAddress, App.accounts.length: ",App.accounts.length);
    });
  },

  bindEvents: function () {
    //$(document).on('click', '#register', function(){ var ad = $('#enter_address').val(); App.handleRegister(ad); });
  },


  getTeams: async function () {
    let teamMap = new Map();
    // first get the team numbers
    await App.contracts.ipl.methods.numTeams().call().then((length)=>{        
      for(var i=0;i<length;i++) {
        // then get the team details and store it in a map
        App.contracts.ipl.methods.teams(i)
        .call().then((team) => {
            teamMap.set(team.name.trim(), team.owner);
            console.log("Team name: " + team.name + ", team owner: " + team.owner);
        });
      }
    });
    return teamMap;
  },

  getPlayers: async function () {
    let playerMap = new Map();
    // first get the number of players
    await App.contracts.ipl.methods.numPlayers().call().then((length) => {
      for(var i=0;i<length;i++)
      {
        // then get the player details and store it in a map
        App.contracts.ipl.methods.players(i)
        .call().then((player) => {
            const p = Object.create(App.Player);
            p.name = player.name.trim();
            p.runs = player.runs;
            p.wickets = player.wickets;
            p.catches = player.catches;
            p.baseRate = player.baseRate;
            p.highestBid = player.highestBid;
            p.tokenId = player.tokenId;
            p.highestBidder = player.highestBidder;
            playerMap.set(p.name, p);
            console.log("Player name: " + p.name + 
                        ", runs: " + p.runs +
                        ", wickets: " + p.wickets +
                        ", catches: " + p.catches +
                        ", baseRate: " + p.baseRate +
                        ", highestBid: " + p.highestBid + 
                        ", tokenId: " + p.tokenId +
                        ", highestBidder: " + p.highestBidder);
        }); 
      }
    });
    return playerMap;
  },

  getSoldPlayers2: async function() {
    let soldPlayerMap = new Map();
    // first get the number of players
    const length = await App.contracts.ipl.methods.soldPlayerCount().call();
      for(var i=0;i<length;i++)
      {
        // then get the player details and store it in a map
        const player = await App.contracts.ipl.methods.soldPlayers(i).call();
        const p = Object.create(App.Players);
        p.name = player.name.trim();
        p.runs = player.runs;
        p.wickets = player.wickets;
        p.catches = player.catches;
        p.baseRate = player.baseRate;
        p.highestBid = player.highestBid;
        p.tokenId = player.tokenId;
        p.highestBidder = player.highestBidder;
        soldPlayerMap.set(p.name, p);
        console.log("Sold Player name: " + p.name +
          ", runs: " + p.runs +
          ", wickets: " + p.wickets +
          ", catches: " + p.catches +
          ", baseRate: " + p.baseRate +
          ", highestBid: " + p.highestBid +
          ", tokenId: " + p.tokenId +
          ", highestBidder: " + p.highestBidder);
      }
    return soldPlayerMap;
  },

  getSoldPlayers: async function() {
    let soldPlayerMap = new Map();
    // first get the number of players
    await App.contracts.ipl.methods.soldPlayerCount().call().then((length) => {
      for(var i=0;i<length;i++)
      {
        // then get the player details and store it in a map
        App.contracts.ipl.methods.soldPlayers(i).call().then((player) => {
          const p = Object.create(App.Players);
          p.name = player.name.trim();
          p.runs = player.runs;
          p.wickets = player.wickets;
          p.catches = player.catches;
          p.baseRate = player.baseRate;
          p.highestBid = player.highestBid;
          p.tokenId = player.tokenId;
          p.highestBidder = player.highestBidder;
          soldPlayerMap.set(p.name, p);
          console.log("Sold Player name: " + p.name +
            ", runs: " + p.runs +
            ", wickets: " + p.wickets +
            ", catches: " + p.catches +
            ", baseRate: " + p.baseRate +
            ", highestBid: " + p.highestBid +
            ", tokenId: " + p.tokenId +
            ", highestBidder: " + p.highestBidder);
        });
      }
    });
    return soldPlayerMap;
  },

  getUnsoldPlayers: async function() {
    let unsoldPlayerMap = new Map();
    // first get the number of players
    await App.contracts.ipl.methods.unsoldPlayerCount().call().then((length) => {
      for(var i=0;i<length;i++)
      {
        // then get the player details and store it in a map
        App.contracts.ipl.methods.unsoldPlayers(i)
        .call().then((player) => {
            const p = Object.create(App.Players);
            p.name = player.name.trim();
            p.runs = player.runs;
            p.wickets = player.wickets;
            p.catches = player.catches;
            p.baseRate = player.baseRate;
            p.highestBid = player.highestBid;
            p.tokenId = player.tokenId;
            p.highestBidder = player.highestBidder;
            unsoldPlayerMap.set(p.name, p);
            console.log("Unsold Player name: " + p.name + 
                        ", runs: " + p.runs +
                        ", wickets: " + p.wickets +
                        ", catches: " + p.catches +
                        ", baseRate: " + p.baseRate +
                        ", highestBid: " + p.highestBid + 
                        ", tokenId: " + p.tokenId +
                        ", highestBidder: " + p.highestBidder);
        }); 
      }
    });
    return unsoldPlayerMap;
  },

  getMyMessage: async function() {
    
    // To use the function, you can call it like this:
    isCurUserAuctioner().then((res) => {

      console.log("isAuctioner: ", res);

      if (res) {
        const buttonDiv = document.getElementById("auction-buttons");

        const button2 = document.createElement("button");
        button2.setAttribute("type", "button");
        button2.textContent = "End Auction";
        button2.classList.add("end-auction-button");

        button2.addEventListener("click", function() {
          // Call the end auction code here
          App.contracts.ipl.methods.auctionEnd()
            .send({ from: App.currentAccount })
            .on('transactionHash', function (hash) {
              toastr["error"]("Auction is closed!");
            })
            .on('receipt', (r) => {
              //location.reload()
            })
            .on('error', (e) => {
              console.log('error');
            });

          // Empty the contents of to be auctioned table
          const table = document.getElementById('player-table');
          table.innerHTML = "";

          App.fetchAndPopulateSoldPlayers();

          // Populate unsold players table
          App.getUnsoldPlayers().then((unsoldPlayers) => {
            App.populateUnsoldPlayers(unsoldPlayers);
          });

        });

        buttonDiv.appendChild(button2);
      }

    });

    App.getPlayers().then((playerMap) => {
      App.populatePlayers(playerMap);
    });

    let teamMap = await App.getTeams();
    App.populateTeams(teamMap);


    // App.getTeams().then((teamMap) => {
    //   App.populateTeams(teamMap);
    // });
  },

  fetchAndPopulateSoldPlayers: async function () {
    const soldPlayers = await App.getSoldPlayers2();
    console.log("Printing in fetchAndPopulateSoldPlayers: ",soldPlayers);
    soldPlayers.forEach((value, key) => {
      console.log(key + " = " + value);
    });
    App.populateSoldPlayers(soldPlayers);
  },

  populateTeams: async function (teamMap) {
    new Web3(App.url).eth.getAccounts((err, acc) => {
      App.accounts = acc;
      console.log("In populateTeams, App.accounts: ", App.accounts);
      console.log("In populateTeams, App.accounts.length: ", App.accounts.length);

      console.log("Got teams: ", teamMap);

      fetch('../js/teams-metadata.json')
        .then(response => response.json())
        .then(teams => {
          const gridContainer = document.getElementById('grid-container');

          teams.forEach(item => {

            var teamName = item.name;

            const cell = document.createElement('div');
            cell.classList.add('grid-cell');

            const img = document.createElement('img');
            img.setAttribute('src', item.image);
            cell.appendChild(img);

            // If the team exists in teamMap, then populate the owner info and disable the dropdown for that team
            if (teamMap.has(teamName)) {
              // If the team exists, populate the owner info and disable the dropdown
              const ownerInfo = document.createElement('p');
              ownerInfo.innerHTML = `Owned by: ${teamMap.get(teamName)}`;
              cell.appendChild(ownerInfo);
            }
            else {
              isCurUserAuctioner().then((res) => {
                if (res) {
                  const dropdown = document.createElement('select');
                  dropdown.style.width = '260px';

                  const defaultOption = document.createElement('option');
                  defaultOption.textContent = 'Select an owner';
                  dropdown.appendChild(defaultOption);

                  for (var i = 0; i < App.accounts.length; i++) {
                    const option = document.createElement('option');
                    option.setAttribute('value', App.accounts[i]);
                    option.textContent = App.accounts[i];
                    dropdown.appendChild(option);
                  }

                  dropdown.addEventListener('change', () => {
                    const selectedValue = dropdown.value;
                    dropdown.disabled = true;
                    console.log("Selected value: ", selectedValue);

                    // Call the smart contract code to create team
                    var option = { from: App.currentAccount };
                    App.contracts.ipl.methods.createTeam(teamName, selectedValue)
                      .send(option).on('transactionHash', function (hash) {
                        // toastr.info("Team created!");
                      })
                      .on('receipt', (r) => {
                        toastr.info("Team created!");
                        // setTimeout(function() {
                        //   location.reload();
                        // }, 5000);
                      })
                      .on('error', (e) => {
                        console.log('error');
                      });

                  });
                  cell.appendChild(dropdown);
                }
              });
            }

            gridContainer.appendChild(cell);

          });
        })
        .catch(error => console.error(error));
    });
  },

  populatePlayers: function (playerMap) {
    fetch('../js/players-metadata.json')
      .then(response => response.json())
      .then(players => {
        // Get the table element from the HTML page
        const table = document.getElementById('player-table');
  
        // Loop through each player and create a table row for them
        players.forEach(player => {
          // Create a new table row
          const row = table.insertRow();
  
          // Create table cells for the player's details
          const imageCell = row.insertCell();
          const nameCell = row.insertCell();
          const runsCell = row.insertCell();
          const wicketsCell = row.insertCell();
          const catchesCell = row.insertCell();
          const baseRateCell = row.insertCell();
          const highestBidCell = row.insertCell();
          const actionCell = row.insertCell(); 
  
          // Create an <img> element for the player's image and set the 'src' attribute to the player's image URL
          const image = document.createElement('img');
          image.src = player.image;
          image.width = 100; // Set the width to 100 pixels
          image.height = 100; // Set the height to 100 pixels
  
          // Add the image to the image cell
          imageCell.appendChild(image);

          var playerName = player.name;
          var runs = player.runs;
          var wickets = player.wickets;
          var catches = player.catches;
          var tokenId, highestBid = 0, highestBidder;
          // Set the text content of the name and team cells to the player's name and team
          // If player already exists in player map, then read from player map
          if (playerMap.has(playerName)) {
            pl = playerMap.get(playerName);
            runs = pl.runs;
            wickets = pl.wickets;
            catches = pl.catches;
            if (typeof pl.highestBid !== 'undefined') {
              highestBid = parseInt(Web3.utils.fromWei(pl.highestBid));
            }
            else
            {
              highestBid = 0;
            }
            highestBidder = pl.highestBidder;
            tokenId = pl.tokenId;
            console.log("Player exists ! Token Id here: ", tokenId);
          }

          nameCell.textContent = playerName;
          runsCell.textContent = runs;
          wicketsCell.textContent = wickets;
          catchesCell.textContent = catches;
          highestBidCell.textContent = highestBid;
  
          let runsWeight = parseInt(runs) * 0.02;
          let wicketsWeight = parseInt(wickets) * 0.03;
          let catchesWeight = parseInt(catches) * 0.03;
          let baseRate = parseInt(runsWeight + wicketsWeight + catchesWeight);
  
          baseRateCell.textContent = baseRate;

          isCurUserAuctioner().then((res) => {
            if (res) {
              // If player is already added, then edit player
              if (playerMap.has(playerName)) {
                // Edit player details

                // Make the cells editable
                runsCell.contentEditable = true;
                wicketsCell.contentEditable = true;
                catchesCell.contentEditable = true;

                var runsNew, wicketsNew, catchesNew;

                // Add an event listener to save the new value when the user finishes editing
                runsCell.addEventListener('blur', (event) => {
                  // Get the new value
                  runsNew = event.target.textContent.trim();

                  // Replace the existing value with the new value
                  runsCell.textContent = runsNew;

                  runsWeight = parseInt(runsNew) * 0.02;
                  wicketsWeight = parseInt(wicketsCell.textContent) * 0.03;
                  catchesWeight = parseInt(catchesCell.textContent) * 0.03;
                  baseRate = parseInt(runsWeight + wicketsWeight + catchesWeight);
                  baseRateCell.textContent = baseRate;
                });

                wicketsCell.addEventListener('blur', (event) => {
                  // Get the new value
                  wicketsNew = event.target.textContent.trim();

                  // Replace the existing value with the new value
                  wicketsCell.textContent = wicketsNew;

                  runsWeight = parseInt(runsCell.textContent) * 0.02;
                  wicketsWeight = parseInt(wicketsNew) * 0.03;
                  catchesWeight = parseInt(catchesCell.textContent) * 0.03;
                  baseRate = parseInt(runsWeight + wicketsWeight + catchesWeight);
                  baseRateCell.textContent = baseRate;
                });

                catchesCell.addEventListener('blur', (event) => {
                  // Get the new value
                  catchesNew = event.target.textContent.trim();

                  // Replace the existing value with the new value
                  catchesCell.textContent = catchesNew;

                  runsWeight = parseInt(runsCell.textContent) * 0.02;
                  wicketsWeight = parseInt(wicketsCell.textContent) * 0.03;
                  catchesWeight = parseInt(catchesNew) * 0.03;
                  baseRate = parseInt(runsWeight + wicketsWeight + catchesWeight);
                  baseRateCell.textContent = baseRate;
                });
                
                runs = parseInt(runsCell.textContent);
                wickets = parseInt(wicketsCell.textContent);
                catches = parseInt(catchesCell.textContent);

                runsWeight = runs * 0.02;
                wicketsWeight = wickets * 0.03;
                catchesWeight = catches * 0.03;
                baseRate = parseInt(runsWeight + wicketsWeight + catchesWeight);
                baseRateCell.textContent = baseRate;

                highestBidCell.textContent = highestBid;
                const editButton = document.createElement("button");
                editButton.innerText = "Edit Player";
                editButton.setAttribute("class", "my-button");
                editButton.addEventListener("click", () => {
                  // Call edit player code in smart contract
                  console.log("Token id: ", tokenId);
                  var option = { from: App.currentAccount };
                  console.log("Updating player info for " + playerName + ", runs: " + runs + ", wickets: " + wickets + ", catches: " +
                              catches + ", baseRate: " + baseRate + ", highestBid: " + highestBid);
                  App.contracts.ipl.methods.updatePlayer(tokenId, runs, wickets, catches, baseRate, highestBid)
                    .send(option).on('transactionHash', function (hash) {
                      toastr.info("Player updated!");
                      location.reload()
                    })
                    .on('receipt', (r) => {
                      //location.reload()
                    })
                    .on('error', (e) => {
                      console.log('error');
                    });

                });
                actionCell.appendChild(editButton);
              }
              else {
                // / Else, Add player code
                highestBidCell.textContent = "N/A";
                const addButton = document.createElement("button");
                addButton.innerText = "Add Player";
                addButton.setAttribute("class", "my-button");
                addButton.addEventListener("click", () => {
                  // Call add player code in smart contract
                  var option = { from: App.currentAccount };
                  App.contracts.ipl.methods.addPlayer(playerName, baseRate, runs, wickets, catches)
                    .send(option).on('transactionHash', function (hash) {
                      toastr.info("Player added!");
                      // setTimeout(function() {
                      //   location.reload();
                      // }, 500);
                    })
                    .on('receipt', (r) => {
                      //location.reload()
                    })
                    .on('error', (e) => {
                      console.log('error');
                    });

                });
                actionCell.appendChild(addButton);
              }
            }
            else {
              if (playerMap.has(playerName)) {
                tokenId = playerMap.get(playerName).tokenId;
                const inputText = document.createElement("input");
                inputText.setAttribute("type", "text");

                // Current user is not auctioner, should see only place bid option
                const bidButton = document.createElement("button");
                bidButton.innerText = "Bid";
                bidButton.setAttribute("class", "my-button");
                bidButton.addEventListener("click", () => {

                  const bid = inputText.value.trim();
                  if (bid === '') {
                    alert('Please enter a value before bidding.');
                  } 
                  else {

                    if(parseInt(bid) < baseRate)
                    {
                      alert('Please enter a value more than the base bid.');
                    }
                    else
                    {
                      // Call place bid code in smart contract
                      tokenId = parseInt(tokenId);
                      console.log("Placing bid for player: " + playerName + ", token: " + tokenId);
                      console.log("Auctioner: ", App.auctioner);
                      App.contracts.ipl.methods.placeBid(tokenId)
                        .send({ from: App.currentAccount, value: Web3.utils.toWei(bid) })
                        .on('transactionHash', function (hash) {
                          toastr.info("Placed bid!");
                        })
                        .on('receipt', (r) => {
                          //location.reload()
                        })
                        .on('error', (e) => {
                          console.log('error');
                        });
                    }
                  }

                });
                actionCell.appendChild(inputText);
                actionCell.appendChild(bidButton);
              }

            }

          });
        });
      })
      .catch(error => console.error(error));
  },

  populateSoldPlayers: function(soldPlayers) {
    
    console.log("Printing in populateSoldPlayers: ", soldPlayers);

    const table = document.getElementById('sold-player-table');
    console.log("I reached populateSoldPlayers");
    console.log("soldPlayers", soldPlayers);
    console.log(typeof(soldPlayers));

    soldPlayers.forEach((player, playerId) => {
      console.log("player", player);
      console.log("playerId", playerId);
      var playerName = player.name;
      var runs = player.runs;
      var wickets = player.wickets;
      var catches = player.catches;
      var highestBid = parseInt(Web3.utils.fromWei(player.highestBid));
      var highestBidder = player.highestBidder;

      console.log("Hello Sold Player name: " + playerName + 
                        ", runs: " + runs +
                        ", wickets: " + wickets +
                        ", catches: " + catches +
                        ", highestBid: " + highestBid + 
                        ", highestBidder: " + highestBidder);

      // Create a new table row
      const row = table.insertRow();
  
      // Create table cells for the player's details
      const nameCell = row.insertCell();
      const runsCell = row.insertCell();
      const wicketsCell = row.insertCell();
      const catchesCell = row.insertCell();
      const highestBidCell = row.insertCell();
      const highestBidderCell = row.insertCell();

      nameCell.textContent = playerName;
      runsCell.textContent = runs;
      wicketsCell.textContent = wickets;
      catchesCell.textContent = catches;
      highestBidCell.textContent = highestBid;
      highestBidderCell.textContent = highestBidder;

    });
  
  },

  populateUnsoldPlayers: function(unsoldPlayers) {
    const table = document.getElementById('unsold-player-table');
    console.log("I reached populateUnsoldPlayers");
    unsoldPlayers.forEach((player, playerId) => {
      var playerName = player.name;
      var runs = player.runs;
      var wickets = player.wickets;
      var catches = player.catches;
      var baseRate = player.baseRate;

      console.log("Hello Unsold Player name: " + playerName + 
                        ", runs: " + runs +
                        ", wickets: " + wickets +
                        ", catches: " + catches +
                        ", baseRate: " + baseRate +
                        ", highestBid: " + highestBid + 
                        ", highestBidder: " + highestBidder);

      // Create a new table row
      const row = table.insertRow();

      // Create table cells for the player's details
      const nameCell = row.insertCell();
      const runsCell = row.insertCell();
      const wicketsCell = row.insertCell();
      const catchesCell = row.insertCell();
      const baseRateCell = row.insertCell();

      nameCell.textContent = playerName;
      runsCell.textContent = runs;
      wicketsCell.textContent = wickets;
      catchesCell.textContent = catches;
      baseRateCell.textContent = baseRate;
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
    //Notification UI config
    toastr.options = {
      "showDuration": "1000",
      "positionClass": "toast-top-left",
      "preventDuplicates": true,
      "closeButton": true
    };
  });
});

// code for reloading the page on account change
window.ethereum.on('accountsChanged', function (){
  location.reload();
})

async function isCurUserAuctioner() {
  var res = false;
  // Get auctioner address
  await App.contracts.ipl.methods.auctioner()
    .call()
    .then((r) => {
      App.auctioner = r;
      if (App.currentAccount.toLowerCase() == App.auctioner.toLowerCase()) {
        res = true;
      }
      else
      {
        res = false;
      }
    });
    return res;
}

async function getCurrentState() {
  var phase = 0;
  // Get auction state
  await App.contracts.ipl.methods.currentPhase()
        .call()
        .then((ph) => {
          console.log("Auction state: " + ph);
          App.auctionState = ph;
          phase = ph;
        });
        return phase;
}
