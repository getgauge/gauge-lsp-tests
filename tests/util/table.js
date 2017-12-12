"use strict"

function tableToArray(table){
    var value = {};

    table.headers.cells.forEach(function (cell,index){
      value[cell] = []
      table.rows.forEach(function (row) {
        value[cell].push(row.cells[index]);
      });    
    })

    return value;
  }

module.exports = {tableToArray:tableToArray};  