let main = {
  variables: {
    turn: 'w',
    selectedpiece: '',
    highlighted: [],
    moveSound: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3'),
    captureSound: new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3'),
    pieces: {
      w_king: { position: '5_1', img: '&#9812;', captured: false, moved: false, type: 'w_king' },
      w_queen: { position: '4_1', img: '&#9813;', captured: false, moved: false, type: 'w_queen' },
      w_bishop1: { position: '3_1', img: '&#9815;', captured: false, moved: false, type: 'w_bishop' },
      w_bishop2: { position: '6_1', img: '&#9815;', captured: false, moved: false, type: 'w_bishop' },
      w_knight1: { position: '2_1', img: '&#9816;', captured: false, moved: false, type: 'w_knight' },
      w_knight2: { position: '7_1', img: '&#9816;', captured: false, moved: false, type: 'w_knight' },
      w_rook1: { position: '1_1', img: '&#9814;', captured: false, moved: false, type: 'w_rook' },
      w_rook2: { position: '8_1', img: '&#9814;', captured: false, moved: false, type: 'w_rook' },
      w_pawn1: { position: '1_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
      w_pawn2: { position: '2_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
      w_pawn3: { position: '3_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
      w_pawn4: { position: '4_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
      w_pawn5: { position: '5_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
      w_pawn6: { position: '6_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
      w_pawn7: { position: '7_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
      w_pawn8: { position: '8_2', img: '&#9817;', captured: false, type: 'w_pawn', moved: false },
      b_king: { position: '5_8', img: '&#9818;', captured: false, moved: false, type: 'b_king' },
      b_queen: { position: '4_8', img: '&#9819;', captured: false, moved: false, type: 'b_queen' },
      b_bishop1: { position: '3_8', img: '&#9821;', captured: false, moved: false, type: 'b_bishop' },
      b_bishop2: { position: '6_8', img: '&#9821;', captured: false, moved: false, type: 'b_bishop' },
      b_knight1: { position: '2_8', img: '&#9822;', captured: false, moved: false, type: 'b_knight' },
      b_knight2: { position: '7_8', img: '&#9822;', captured: false, moved: false, type: 'b_knight' },
      b_rook1: { position: '1_8', img: '&#9820;', captured: false, moved: false, type: 'b_rook' },
      b_rook2: { position: '8_8', img: '&#9820;', captured: false, moved: false, type: 'b_rook' },
      b_pawn1: { position: '1_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
      b_pawn2: { position: '2_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
      b_pawn3: { position: '3_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
      b_pawn4: { position: '4_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
      b_pawn5: { position: '5_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
      b_pawn6: { position: '6_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
      b_pawn7: { position: '7_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false },
      b_pawn8: { position: '8_7', img: '&#9823;', captured: false, type: 'b_pawn', moved: false }
    }
  },

  methods: {
    getPieceHTML: function(pieceName) {
      if (!pieceName || pieceName === 'null') return '';
      let isWhite = pieceName.charAt(0) === 'w';
      let pieceClass = isWhite ? 'white-piece' : 'black-piece';
      return `<span class="${pieceClass} piece-icon">${main.variables.pieces[pieceName].img}</span>`;
    },

    addCapturedPiece: function(pieceName) {
      let html = main.methods.getPieceHTML(pieceName);
      if (pieceName.charAt(0) === 'w') {
        $('#black-captured-pool').append(html);
      } else {
        $('#white-captured-pool').append(html);
      }
    },

    checkPawnPromotion: function(pieceName, targetId) {
      let p = main.variables.pieces[pieceName];
      if (!p) return false;
      
      let isWhite = pieceName.charAt(0) === 'w';
      let isPawn = p.type.includes('pawn');
      let row = targetId.split('_')[1];

      if (isPawn && ((isWhite && row === '8') || (!isWhite && row === '1'))) {
        let unicodeMap = {
          'queen': isWhite ? '&#9813;' : '&#9819;',
          'rook': isWhite ? '&#9814;' : '&#9820;',
          'bishop': isWhite ? '&#9815;' : '&#9821;',
          'knight': isWhite ? '&#9816;' : '&#9822;'
        };

        let colorClass = isWhite ? 'white-piece' : 'black-piece';
        
        $('.promo-btn').each(function() {
          let pieceType = $(this).attr('data-piece');
          $(this).html(`<span class="${colorClass} piece-icon">${unicodeMap[pieceType]}</span>`);
        });

        $('#promotion-modal').addClass('show-modal');

        $('.promo-btn').off('click').on('click', function() {
          let chosenType = $(this).attr('data-piece');
          
          p.type = (isWhite ? 'w_' : 'b_') + chosenType;
          p.img = unicodeMap[chosenType];
          
          $('#' + targetId).html(main.methods.getPieceHTML(pieceName));
          
          $('#promotion-modal').removeClass('show-modal');
          main.methods.endturn();
        });
        
        return true; 
      }
      return false; 
    },

    gamesetup: function() {
      $('.gamecell').attr('chess', 'null');
      $('#white-captured-pool').empty(); 
      $('#black-captured-pool').empty();
      
      for (let gamepiece in main.variables.pieces) {
        $('#' + main.variables.pieces[gamepiece].position).html(main.methods.getPieceHTML(gamepiece));
        $('#' + main.variables.pieces[gamepiece].position).attr('chess', gamepiece);
      }
    },

    getRawMoves: function(pieceName) {
      let position = { x: '', y: '' };
      let p = main.variables.pieces[pieceName];
      position.x = p.position.split('_')[0];
      position.y = p.position.split('_')[1];

      let options = []; 
      let coordinates = [];
      let startpoint = p.position;
      let c1, c2, c3, c4, c5, c6, c7, c8;

      switch (p.type) {
        case 'w_king':
          let w_k_moves = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }];
          
          if ($('#6_1').attr('chess') == 'null' && $('#7_1').attr('chess') == 'null' && p.moved == false && main.variables.pieces['w_rook2'].moved == false) {
            w_k_moves.push({x: 2, y: 0});
          }
          if ($('#2_1').attr('chess') == 'null' && $('#3_1').attr('chess') == 'null' && $('#4_1').attr('chess') == 'null' && p.moved == false && main.variables.pieces['w_rook1'].moved == false) {
            w_k_moves.push({x: -2, y: 0});
          }
          
          coordinates = w_k_moves.map(function(val){
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          });
          options = (main.methods.options(startpoint, coordinates, p.type)).slice(0);
          break;

        case 'b_king':
          let b_k_moves = [{ x: 1, y: 1 },{ x: 1, y: 0 },{ x: 1, y: -1 },{ x: 0, y: -1 },{ x: -1, y: -1 },{ x: -1, y: 0 },{ x: -1, y: 1 },{ x: 0, y: 1 }];
          
          if ($('#6_8').attr('chess') == 'null' && $('#7_8').attr('chess') == 'null' && p.moved == false && main.variables.pieces['b_rook2'].moved == false) {
            b_k_moves.push({x: 2, y: 0});
          }
          if ($('#2_8').attr('chess') == 'null' && $('#3_8').attr('chess') == 'null' && $('#4_8').attr('chess') == 'null' && p.moved == false && main.variables.pieces['b_rook1'].moved == false) {
            b_k_moves.push({x: -2, y: 0});
          }
          
          coordinates = b_k_moves.map(function(val){
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          });
          options = (main.methods.options(startpoint, coordinates, p.type)).slice(0);
          break;

        case 'w_queen':
        case 'w_bishop':
        case 'w_rook':
          if (p.type == 'w_queen' || p.type == 'w_bishop') {
            c1 = main.methods.w_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
            c2 = main.methods.w_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
            c3 = main.methods.w_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
            c4 = main.methods.w_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
            coordinates = c1.concat(c2).concat(c3).concat(c4);
          }
          if (p.type == 'w_queen' || p.type == 'w_rook') {
            c5 = main.methods.w_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
            c6 = main.methods.w_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
            c7 = main.methods.w_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
            c8 = main.methods.w_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
            coordinates = (coordinates || []).concat(c5).concat(c6).concat(c7).concat(c8);
          }
          options = coordinates.slice(0);
          break;

        case 'b_queen':
        case 'b_bishop':
        case 'b_rook':
          if (p.type == 'b_queen' || p.type == 'b_bishop') {
            c1 = main.methods.b_options(position,[{x: 1, y: 1},{x: 2, y: 2},{x: 3, y: 3},{x: 4, y: 4},{x: 5, y: 5},{x: 6, y: 6},{x: 7, y: 7}]);
            c2 = main.methods.b_options(position,[{x: 1, y: -1},{x: 2, y: -2},{x: 3, y: -3},{x: 4, y: -4},{x: 5, y: -5},{x: 6, y: -6},{x: 7, y: -7}]);
            c3 = main.methods.b_options(position,[{x: -1, y: 1},{x: -2, y: 2},{x: -3, y: 3},{x: -4, y: 4},{x: -5, y: 5},{x: -6, y: 6},{x: -7, y: 7}]);
            c4 = main.methods.b_options(position,[{x: -1, y: -1},{x: -2, y: -2},{x: -3, y: -3},{x: -4, y: -4},{x: -5, y: -5},{x: -6, y: -6},{x: -7, y: -7}]);
            coordinates = c1.concat(c2).concat(c3).concat(c4);
          }
          if (p.type == 'b_queen' || p.type == 'b_rook') {
            c5 = main.methods.b_options(position,[{x: 1, y: 0},{x: 2, y: 0},{x: 3, y: 0},{x: 4, y: 0},{x: 5, y: 0},{x: 6, y: 0},{x: 7, y: 0}]);
            c6 = main.methods.b_options(position,[{x: 0, y: 1},{x: 0, y: 2},{x: 0, y: 3},{x: 0, y: 4},{x: 0, y: 5},{x: 0, y: 6},{x: 0, y: 7}]);
            c7 = main.methods.b_options(position,[{x: -1, y: 0},{x: -2, y: 0},{x: -3, y: 0},{x: -4, y: 0},{x: -5, y: 0},{x: -6, y: 0},{x: -7, y: 0}]);
            c8 = main.methods.b_options(position,[{x: 0, y: -1},{x: 0, y: -2},{x: 0, y: -3},{x: 0, y: -4},{x: 0, y: -5},{x: 0, y: -6},{x: 0, y: -7}]);
            coordinates = (coordinates || []).concat(c5).concat(c6).concat(c7).concat(c8);
          }
          options = coordinates.slice(0);
          break;

        case 'w_knight':
        case 'b_knight':
          coordinates = [{ x: -1, y: 2 },{ x: 1, y: 2 },{ x: 1, y: -2 },{ x: -1, y: -2 },{ x: 2, y: 1 },{ x: 2, y: -1 },{ x: -2, y: -1 },{ x: -2, y: 1 }].map(function(val){
            return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
          });
          options = (main.methods.options(startpoint, coordinates, p.type)).slice(0);
          break;

        case 'w_pawn':
          if (p.moved == false) {
            coordinates = [{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 1, y: 1 },{ x: -1, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          } else {
            coordinates = [{ x: 0, y: 1 },{ x: 1, y: 1 },{ x: -1, y: 1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          }
          options = (main.methods.options(startpoint, coordinates, p.type)).slice(0);
          break;

        case 'b_pawn':
          if (p.moved == false) {
            coordinates = [{ x: 0, y: -1 },{ x: 0, y: -2 },{ x: 1, y: -1 },{ x: -1, y: -1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          } else {
            coordinates = [{ x: 0, y: -1 },{ x: 1, y: -1 },{ x: -1, y: -1 }].map(function(val){
              return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
            });
          }
          options = (main.methods.options(startpoint, coordinates, p.type)).slice(0);
          break;
      }
      return options;
    },

    isKingInCheck: function(color) {
      let kingPiece = color + '_king';
      let kingPos = main.variables.pieces[kingPiece].position;
      let opponentColor = color === 'w' ? 'b' : 'w';
      
      for (let pieceName in main.variables.pieces) {
        let p = main.variables.pieces[pieceName];
        if (p.captured || pieceName.charAt(0) !== opponentColor) continue;
        
        let moves = main.methods.getRawMoves(pieceName);
        if (moves.indexOf(kingPos) !== -1) {
          return true;
        }
      }
      return false;
    },

    getLegalMoves: function(pieceName) {
      let rawMoves = main.methods.getRawMoves(pieceName);
      let legalMoves = [];
      let color = pieceName.charAt(0);
      let p = main.variables.pieces[pieceName];
      let originalPos = p.position;

      rawMoves.forEach(targetId => {
        let targetPieceName = $('#' + targetId).attr('chess');
        let targetPiece = targetPieceName !== 'null' ? main.variables.pieces[targetPieceName] : null;

        $('#' + originalPos).attr('chess', 'null');
        $('#' + targetId).attr('chess', pieceName);
        p.position = targetId;
        if (targetPiece) targetPiece.captured = true;

        let inCheck = main.methods.isKingInCheck(color);

        $('#' + originalPos).attr('chess', pieceName);
        $('#' + targetId).attr('chess', targetPieceName !== 'null' ? targetPieceName : 'null');
        p.position = originalPos;
        if (targetPiece) targetPiece.captured = false;

        if (!inCheck) {
          legalMoves.push(targetId);
        }
      });

      return legalMoves;
    },

    checkGameState: function(color) {
      let hasLegalMoves = false;
      for (let pieceName in main.variables.pieces) {
        let p = main.variables.pieces[pieceName];
        if (!p.captured && pieceName.charAt(0) === color) {
          let moves = main.methods.getLegalMoves(pieceName);
          if (moves.length > 0) {
            hasLegalMoves = true;
            break;
          }
        }
      }

      let inCheck = main.methods.isKingInCheck(color);
      let turnText = color === 'w' ? "White's Turn" : "Black's Turn";
      
      $('#game-status-banner').removeClass('check-alert');

      if (!hasLegalMoves) {
        let resultMsg = "";
        if (inCheck) {
          let winner = color === 'w' ? "Black" : "White";
          resultMsg = `Checkmate! ${winner} Wins.`;
          $('#status-text').text("Game Over");
        } else {
          resultMsg = "Stalemate! It's a Draw.";
          $('#status-text').text("Game Over");
        }
        
        $('#game-result').text(resultMsg);
        $('#game-over-modal').addClass('show-modal');
        $('.gamecell').off('click');
        
      } else if (inCheck) {
        $('#status-text').text("CHECK!");
        $('#game-status-banner').addClass('check-alert');
        
        window.setTimeout(function(){
          $('#game-status-banner').removeClass('check-alert');
          $('#status-text').text(turnText);
        }, 1500);
        
      } else {
        $('#status-text').text(turnText);
      }
    },

    moveoptions: function(selectedpiece) {
      if (main.variables.highlighted.length != 0) {
        main.methods.togglehighlight(main.variables.highlighted);
      }
      
      let legalMoves = main.methods.getLegalMoves(selectedpiece);
      main.variables.highlighted = legalMoves;
      main.methods.togglehighlight(legalMoves);
    },

    options: function(startpoint, coordinates, piecetype) { 
      coordinates = coordinates.filter(val => {
        let pos = { x: 0, y: 0 };
        pos.x = parseInt(val.split('_')[0]);
        pos.y = parseInt(val.split('_')[1]);

        if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) { 
          return val;
        }
      });

      switch (piecetype) {
        case 'w_king':
        case 'w_knight':
          coordinates = coordinates.filter(val => {
            return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'b');
          });
          break;
        case 'b_king':
        case 'b_knight':
          coordinates = coordinates.filter(val => {
            return ($('#' + val).attr('chess') == 'null' || ($('#' + val).attr('chess')).slice(0,1) == 'w');
          });
          break;
        case 'w_pawn':
          coordinates = coordinates.filter(val => {
            let sp = { x: 0, y: 0 };
            let coordinate = val.split('_');
            sp.x = startpoint.split('_')[0];
            sp.y = startpoint.split('_')[1];
            
            if (coordinate[0] != sp.x) { 
              return ($('#' + val).attr('chess') != 'null' && ($('#' + val).attr('chess')).slice(0,1) == 'b'); 
            } else { 
              if (coordinate[1] == (parseInt(sp.y) + 2) && $('#' + sp.x + '_' + (parseInt(sp.y) + 1)).attr('chess') != 'null') {
              } else {
                return ($('#' + val).attr('chess') == 'null'); 
              }
            }
          });
          break;
        case 'b_pawn':
          coordinates = coordinates.filter(val => {
            let sp = { x: 0, y: 0 };
            let coordinate = val.split('_');
            sp.x = startpoint.split('_')[0];
            sp.y = startpoint.split('_')[1];
            
            if (coordinate[0] != sp.x) { 
              return ($('#' + val).attr('chess') != 'null' && ($('#' + val).attr('chess')).slice(0,1) == 'w'); 
            } else { 
              if (coordinate[1] == (parseInt(sp.y) - 2) && $('#' + sp.x + '_' + (parseInt(sp.y) - 1)).attr('chess') != 'null') {
              } else {
                return ($('#' + val).attr('chess') == 'null'); 
              }
            }
          });
          break;
      }      
      return coordinates;
    },

    w_options: function (position, coordinates) {
      let flag = false;
      return coordinates.map(function(val){ 
          return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
        }).filter(val => {
          let pos = { x: 0, y: 0 };
          pos.x = parseInt(val.split('_')[0]);
          pos.y = parseInt(val.split('_')[1]);
          if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) { 
            return val;
          }
        }).filter(val => { 
          if (flag == false) {
            if ($('#' + val).attr('chess') == 'null') {
              return val;
            } else if (($('#' + val).attr('chess')).slice(0,1) == 'b') {
              flag = true;
              return val;
            } else if (($('#' + val).attr('chess')).slice(0,1) == 'w') {
              flag = true;
            }
          }
        });
    },

    b_options: function (position, coordinates) {
      let flag = false;
      return coordinates.map(function(val){ 
          return (parseInt(position.x) + parseInt(val.x)) + '_' + (parseInt(position.y) + parseInt(val.y));
        }).filter(val => {
          let pos = { x: 0, y: 0 };
          pos.x = parseInt(val.split('_')[0]);
          pos.y = parseInt(val.split('_')[1]);
          if (!(pos.x < 1) && !(pos.x > 8) && !(pos.y < 1) && !(pos.y > 8)) { 
            return val;
          }
        }).filter(val => { 
          if (flag == false) {
            if ($('#' + val).attr('chess') == 'null') {
              return val;
            } else if (($('#' + val).attr('chess')).slice(0,1) == 'w') {
              flag = true;
              return val;
            } else if (($('#' + val).attr('chess')).slice(0,1) == 'b') {
              flag = true;
            }
          }
        });
    },

capture: function (target) {
      let selectedpiece = {
        name: $('#' + main.variables.selectedpiece).attr('chess'),
        id: main.variables.selectedpiece
      };
      
      main.methods.addCapturedPiece(target.name);

      $('#' + target.id).html(main.methods.getPieceHTML(selectedpiece.name));
      $('#' + target.id).attr('chess', selectedpiece.name);
      
      $('#' + selectedpiece.id).html('');
      $('#' + selectedpiece.id).attr('chess', 'null');
      
      main.variables.pieces[selectedpiece.name].position = target.id;
      main.variables.pieces[selectedpiece.name].moved = true;
      main.variables.pieces[target.name].captured = true;

      main.variables.captureSound.play();
    },

    move: function (target) {
      let selectedpiece = $('#' + main.variables.selectedpiece).attr('chess');
      
      $('#' + target.id).html(main.methods.getPieceHTML(selectedpiece));
      $('#' + target.id).attr('chess', selectedpiece);
      
      $('#' + main.variables.selectedpiece).html('');
      $('#' + main.variables.selectedpiece).attr('chess', 'null');
      
      main.variables.pieces[selectedpiece].position = target.id;
      main.variables.pieces[selectedpiece].moved = true;

      main.variables.moveSound.play();
    },

    endturn: function(){
      if (main.variables.turn === 'w') {
        main.variables.turn = 'b';
      } else if (main.variables.turn === 'b') {
        main.variables.turn = 'w';
      }

      main.methods.togglehighlight(main.variables.highlighted);
      main.variables.highlighted.length = 0;
      main.variables.selectedpiece = '';

      main.methods.checkGameState(main.variables.turn);
    },

    togglehighlight: function(options) {
      options.forEach(function(element) {
        $('#' + element).toggleClass("green shake-little neongreen_txt");
      });
    }
  }
};

$(document).ready(function() {
  main.methods.gamesetup();

  $('.gamecell').click(function(e) {
    let cellId = $(this).attr('id');

    let selectedpiece = {
      name: '',
      id: main.variables.selectedpiece
    };

    if (main.variables.selectedpiece == '') {
      selectedpiece.name = $('#' + cellId).attr('chess');
    } else {
      selectedpiece.name = $('#' + main.variables.selectedpiece).attr('chess');
    }

    let target = {
      name: $(this).attr('chess'),
      id: cellId
    };

    if (main.variables.selectedpiece == '' && target.name.slice(0,1) == main.variables.turn) { 
      main.variables.selectedpiece = cellId;
      main.methods.moveoptions(target.name);
    } 
    else if (main.variables.selectedpiece !='' && target.name == 'null') { 
      
     if (main.variables.highlighted.indexOf(target.id) !== -1) {
         
        let t0 = (selectedpiece.name === 'w_king');
        let t1 = (selectedpiece.name === 'b_king');
        let t2 = (main.variables.pieces[selectedpiece.name] && main.variables.pieces[selectedpiece.name].moved == false);
        
        let w_rook2_unmoved = (main.variables.pieces['w_rook2'] && main.variables.pieces['w_rook2'].moved == false);
        let w_rook1_unmoved = (main.variables.pieces['w_rook1'] && main.variables.pieces['w_rook1'].moved == false);
        let b_rook2_unmoved = (main.variables.pieces['b_rook2'] && main.variables.pieces['b_rook2'].moved == false);
        let b_rook1_unmoved = (main.variables.pieces['b_rook1'] && main.variables.pieces['b_rook1'].moved == false);

        if (t0 && t2 && w_rook2_unmoved && target.id == '7_1') { 
          let k_position = '5_1';
          let k_target = '7_1';
          let r_position = '8_1';
          let r_target = '6_1';
  
          main.variables.pieces['w_king'].position = '7_1';
          main.variables.pieces['w_king'].moved = true;
          $('#'+k_position).html('').attr('chess','null');
          $('#'+k_target).html(main.methods.getPieceHTML('w_king')).attr('chess','w_king');
  
          main.variables.pieces['w_rook2'].position = '6_1';
          main.variables.pieces['w_rook2'].moved = true;
          $('#'+r_position).html('').attr('chess','null');
          $('#'+r_target).html(main.methods.getPieceHTML('w_rook2')).attr('chess','w_rook2');
  main.variables.moveSound.play();
          main.methods.endturn();
  
        } else if (t0 && t2 && w_rook1_unmoved && target.id == '3_1') { 
          let k_position = '5_1';
          let k_target = '3_1';
          let r_position = '1_1';
          let r_target = '4_1';
  
          main.variables.pieces['w_king'].position = '3_1';
          main.variables.pieces['w_king'].moved = true;
          $('#'+k_position).html('').attr('chess','null');
          $('#'+k_target).html(main.methods.getPieceHTML('w_king')).attr('chess','w_king');
  
          main.variables.pieces['w_rook1'].position = '4_1';
          main.variables.pieces['w_rook1'].moved = true;
          $('#'+r_position).html('').attr('chess','null');
          $('#'+r_target).html(main.methods.getPieceHTML('w_rook1')).attr('chess','w_rook1');
  main.variables.moveSound.play();
          main.methods.endturn();

        } else if (t1 && t2 && b_rook2_unmoved && target.id == '7_8') { 
          let k_position = '5_8';
          let k_target = '7_8';
          let r_position = '8_8';
          let r_target = '6_8';
  
          main.variables.pieces['b_king'].position = '7_8';
          main.variables.pieces['b_king'].moved = true;
          $('#'+k_position).html('').attr('chess','null');
          $('#'+k_target).html(main.methods.getPieceHTML('b_king')).attr('chess','b_king');
  
          main.variables.pieces['b_rook2'].position = '6_8';
          main.variables.pieces['b_rook2'].moved = true;
          $('#'+r_position).html('').attr('chess','null');
          $('#'+r_target).html(main.methods.getPieceHTML('b_rook2')).attr('chess','b_rook2');
  main.variables.moveSound.play();
          main.methods.endturn();
          
        } else if (t1 && t2 && b_rook1_unmoved && target.id == '3_8') { 
          let k_position = '5_8';
          let k_target = '3_8';
          let r_position = '1_8';
          let r_target = '4_8';
  
          main.variables.pieces['b_king'].position = '3_8';
          main.variables.pieces['b_king'].moved = true;
          $('#'+k_position).html('').attr('chess','null');
          $('#'+k_target).html(main.methods.getPieceHTML('b_king')).attr('chess','b_king');
  
          main.variables.pieces['b_rook1'].position = '4_8';
          main.variables.pieces['b_rook1'].moved = true;
          $('#'+r_position).html('').attr('chess','null');
          $('#'+r_target).html(main.methods.getPieceHTML('b_rook1')).attr('chess','b_rook1');
  main.variables.moveSound.play();
          main.methods.endturn();

        } else { 
          main.methods.move(target);
          
          let isPromoting = main.methods.checkPawnPromotion(selectedpiece.name, target.id);
          if (!isPromoting) {
            main.methods.endturn();
          }
        }
      }
    } 
    else if (main.variables.selectedpiece !='' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0,1) != target.name.slice(0,1)) { 
      if (main.variables.highlighted.indexOf(target.id) !== -1) { 
        main.methods.capture(target);
        
        let isPromoting = main.methods.checkPawnPromotion(selectedpiece.name, target.id);
        if (!isPromoting) {

            main.methods.endturn();
        }
      }
    }
    else if (main.variables.selectedpiece !='' && target.name != 'null' && target.id != selectedpiece.id && selectedpiece.name.slice(0,1) == target.name.slice(0,1)) { 
      main.methods.togglehighlight(main.variables.highlighted);
      main.variables.highlighted.length = 0;
      main.variables.selectedpiece = target.id;
      main.methods.moveoptions(target.name);
    }
    else if (main.variables.selectedpiece != '' && target.id === selectedpiece.id) {
      main.methods.togglehighlight(main.variables.highlighted);
      main.variables.highlighted.length = 0;
      main.variables.selectedpiece = '';
    }
  });

  $('body').contextmenu(function(e) {
    e.preventDefault();
  });
});