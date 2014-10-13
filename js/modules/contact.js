$(function(){

    /* Валидация */
    (function ValidateById()
    {
        var $form = $('form.js-validate-contact');

        $form.validate(
            {
                debug: true,

                rules:
                {
                    f_Name: { required: true },
                    f_Email: { required: true },
                    f_Message: { required: true }
                },
                messages:
                {
                    f_Name: { required: "" },
                    f_Email: { required: "" },
                    f_Message: { required: "" }
                },

                submitHandler: function(form)
                {
                    $.ajax(
                        {
                            url: $form.attr("action"),
                            data: $form.serialize(),
                            method: "POST",
                            success: function(data)
                            {
                                $form.find('input[type=submit]').remove();
                                $('.form-wrapper').append(data);

                            },
                            error: function(data)
                            {
                                alert("Ошибка: " + data.status + ' ' + data.statusText);
                            }
                        });

                    return false;
                }
            });
    })();

});