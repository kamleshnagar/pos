$(document).ready(function () {
    $("#inputbarcode").on("keypress", function (e) {
        if (e.which === 13) {
            let barcode = $("#inputbarcode").val();
            let barcodelength = barcode.length;
            let invalibarcode = $("#invalidbarcode").text();
            if (barcodelength === 10) {
                alert(`The barcode "${barcode}" is valid but found function is not avilable to find the details of the barcode`);
                $("#inputbarcode").val("")
            }
            else {
                console.log("barcode not valid")
                $("#inputbarcode").val("");
                $("#invalidbarcode").text("Inventory or Product not available!");
            };

        };
    });

        $("#inputnum").on("keypress", function (e) {
            if (e.which === 13) {
                let num = $("#inputnum").val();
                let numlength = num.length;
                let invalinum = $("#invalidnum").text();
                if (numlength === 10) {
                    alert(`Entered mobile number is ${num}`);
                    $("#inputnum").val("")
                }
                else {
                    console.log("num not valid")
                    $("#inputnum").val("");
                    $("#invalidnum").text("Invalid mobile number.");
                };

        };
    });

});









