function twoDigit (number) {
    return parseFloat(Math.round(number * 100) / 100).toFixed(2)
}

$(document).ready(function () {

  jQuery.getJSON( "receipt_data/dashboard_receipt_data.json", function( data ) {

      $.each( data, function( index, element ) {
        // console.log(element);
        var template = $("#receiptTemplate").html()
        // console.log(template)
        var compiled = _.template(template)
        $('#items').append(compiled(element));
      });
     
      // packery();
      modalReceipt(data);
      isotope();
      receiptSortType();
      sortGroup();
  });

})

function isotope(sort) {
    sort = typeof sort !== 'undefined' ? sort : true;

    var $container = $('.isotope');
    $container.isotope({
        layoutMode:'fitRows',
        sortAscending: sort,
        transformsEnabled: false,
        itemSelector: '.element-item',
        sortBy: 'original-order',
        // columnWidth: 330,
        // rowHeight: 100,
        // gutter: 2
        getSortData: {
          merchant: '.merchant',
          cardType: '.cardType',
          total: '.total parseFloat',
          // date: function( itemElem ) {
          //   // var weight = $( itemElem ).find('.weight').text();
          //   // return parseFloat( weight.replace( /[\(\)]/g, '') );
          // }
        }
    });

     // bind sort button click
      $('#sorts').on( 'click', 'button', function() {
        var sortByValue = $(this).attr('data-sort-by');
        $container.isotope({ sortBy: sortByValue });
      });

}

function receiptSortType() {
    $('#receiptSortType').on('click', function() {
        if ($(this).hasClass('btn-primary')) {
            // sort descending
            isotope(false);
            $(this).html('<span class="glyphicon glyphicon-chevron-down">Descending Order</span>');
        }
        else {
            // sort ascending
            isotope(true);
            $(this).html('<span class="glyphicon glyphicon-chevron-up">Ascending Order</span>');
        }

        var data_sort = $('.btn-group > .btn.active').attr('data-sort-by');
        $('.isotope').isotope({ sortBy: data_sort });

        $(this).toggleClass('btn-primary');
        $(this).toggleClass('btn-danger');

    })
} 

function sortGroup() {
    $(".btn-group > .btn").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
    });
}

function packery() {
    var pckry;

    var $container = $('.packery-container');
    $container.packery({
        columnWidth: 330,
        rowHeight: 100,
        gutter: 2
    });
    // get item elements, jQuery-ify them
    var $itemElems = $( $container.packery('getItemElements'));

    // make item elements draggable
    $itemElems.draggable();

    // bind Draggable events to Packery
    $container.packery( 'bindUIDraggableEvents', $itemElems );

    pckry = $container.data('packery');
}



function modalReceipt(data) {
    $('.element-item').on('click',function() {
        // $('#receiptModal .modal-title').html('');
        // $('#receiptModal .modal-title').
        var id = $(this).attr('row');

        var object = _.findWhere(data, {'receipt_id': id|0});
        $('#receiptModal .modal-title').html(object.Merchant);
        $('#receiptModal .modal-body #merchant').html(object.Merchant);
        $('#receiptModal .modal-body #address').html(object.Address+"<br>"+object.City+","+object.State+" "+object.zip);
        $('#receiptModal .modal-body #date').html(object.timestamp);
        $('#receiptModal .modal-body #itemized').html('');
        $(object.Items).each(function() {
            $('#receiptModal .modal-body #itemized').append("1 "+this.title+":    "+'<span style="float:right; padding-right:10px"><img src="image/bitcoin.png">'+twoDigit(this.price)+"</span><br>");
        })
        $('#receiptModal .modal-body #subtotal').html('<span style="margin-left:-4px;">Subtotal:</span>'+'<span style="float:right; padding-right: 10px"><img src="image/bitcoin.png">'+twoDigit(object.Subtotal)+"</span><br>");
        $('#receiptModal .modal-body #tax').html('<span style="margin-left:-4px">Tax:</span>'+'<span style="float:right; padding-right: 10px"><img src="image/bitcoin.png">'+twoDigit(object.Tax)+"</span><br>");
        $('#receiptModal .modal-body #total').html('<span style="margin-left:-4px">Total:</span>'+'<span style="float:right; padding-right: 10px"><img src="image/bitcoin.png">'+twoDigit(object.Total)+"</span><br>");

        $('#receiptModal').modal('show');
    })
}


function recommendations() {
    var recs = $('#recommendations')
    if (recs.css('display') == 'none') {
        recs.fadeIn( "slow", function() {});   
    }
    else {
        recs.fadeOut(450, function(){});
    }
}
