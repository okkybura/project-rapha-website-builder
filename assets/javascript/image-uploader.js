  var selectedfiles;
    var selectedfile;
    var fileIndex;
    $(document).ready(function () {

        if (window.File && window.FileList && window.FileReader) {
            $('.image-upload').each(function () {
                const $input = $(this);

                $input.on("change", function (e) {
                    const files = e.target.files;
                    const filesLength = files.length;

                    for (let i = 0; i < filesLength; i++) {
                        const selectedfile = files[i];

                        const fileReader = new FileReader();

                        fileReader.onload = function (e) {
                            const imgSrc = e.target.result;

                            // Insert preview AFTER the current input only
                            $("<span class='pip'>" +
                                "<img class='imageThumb' src='" + imgSrc + "' title='" + selectedfile.name + "' />" +
                                "<span class='remove' title='Remove image'>" +
                                "<svg class='bi bi-trash' fill='currentColor' height='16' viewBox='0 0 16 16' width='16' xmlns='http://www.w3.org/2000/svg'>" +
                                "<path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z'/>" +
                                "<path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z'/>" +
                                "</svg>" +
                                "</span>" +
                                "</span>").insertAfter($input);
                        };

                        fileReader.readAsDataURL(selectedfile);
                    }
                });
            });

        }
        else {
            alert("Your browser doesn't support to File API")
        }
    });

    function removeImage(name) {
        selectedfiles = document.getElementsByClassName("image-upload").files;
        var final = [];
        $.each(selectedfiles, function (index, value) {
            if (value.name !== name) {
                console.log(value);
                final.push(value);
            }
        });
        console.log('List', final);
        document.getElementsByClassName("image-upload").files = new FileListItem(final);
    }

    function FileListItem(a) {
        a = [].slice.call(Array.isArray(a) ? a : arguments)
        for (var c, b = c = a.length, d = !0; b-- && d;) d = a[b] instanceof File
        if (!d) throw new TypeError("expected argument to FileList is File or array of File objects")
        for (b = (new ClipboardEvent("")).clipboardData || new DataTransfer; c--;) b.items.add(a[c])
        return b.files
    }

    $(document).on('click', '.remove', function () {
        $(this).closest('.pip').remove();
    });
