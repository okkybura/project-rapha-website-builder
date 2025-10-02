  var selectedfiles;
    var selectedfile;
    var fileIndex;
    $(document).ready(function () {

        if (window.File && window.FileList && window.FileReader) {
            $("#files").on("change", function (e) {
                var files = e.target.files,
                    selectedfiles = files;
                console.log(selectedfiles);
                filesLength = files.length;

                for (var i = 0; i < filesLength; i++) {
                    selectedfile = files[i]
                    fileIndex = i;
                    // console.log(i, f);

                    var fileReader = new FileReader();
                    fileReader.onload = (function (e) {
                        var file = e.target;
                        $("<span class=\"pip\">" +
                            "<img class=\"imageThumb\" src=\"" + e.target.result +
                            "\" title=\"" + selectedfile.name + "\"/>" +
                            "<span class=\"remove\" onclick=\"removeImage('" +
                            selectedfile.name + "')\"><svg class='bi bi-trash'fill=currentColor height=16 viewBox='0 0 16 16'width=16 xmlns=http://www.w3.org/2000/svg><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z'/></svg></span>" +
                            "</span>").insertAfter("#files");

                        $(".remove").click(function () {
                            $(this).parent(".pip").remove();
                        });



                    });
                    fileReader.readAsDataURL(selectedfile);
                }
            });
        }
        else {
            alert("Your browser doesn't support to File API")
        }
    });

    function removeImage(name) {
        selectedfiles = document.getElementById("files").files;
        var final = [];
        $.each(selectedfiles, function (index, value) {
            if (value.name !== name) {
                console.log(value);
                final.push(value);
            }
        });
        console.log('List', final);
        document.getElementById("files").files = new FileListItem(final);
    }

    function FileListItem(a) {
        a = [].slice.call(Array.isArray(a) ? a : arguments)
        for (var c, b = c = a.length, d = !0; b-- && d;) d = a[b] instanceof File
        if (!d) throw new TypeError("expected argument to FileList is File or array of File objects")
        for (b = (new ClipboardEvent("")).clipboardData || new DataTransfer; c--;) b.items.add(a[c])
        return b.files
    }
