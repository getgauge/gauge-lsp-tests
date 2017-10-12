function tableToArray(table){
  var value = [];
  table.rows.forEach(function (row) {
    value.push(row.cells[0]);
  });
  return value;
}

module.exports = {tableToArray:tableToArray};  