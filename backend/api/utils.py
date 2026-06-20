from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # بنخلي جانجو يجهز الرد بتاعه العادي الأول
    response = exception_handler(exc, context)

    if response is not None:
        original_data = response.data
        detailed_message = "Something went wrong." # رسالة افتراضية
        
        # 1. محاولة استخراج الأخطاء وتحويلها لنص مقروء
        if isinstance(original_data, dict):
            error_messages = []
            for field, errors in original_data.items():
                # لو الخطأ عبارة عن لستة (وده الديفولت بتاع DRF)
                if isinstance(errors, list):
                    error_text = " ".join([str(e) for e in errors])
                else:
                    error_text = str(errors)
                
                # تظهير اسم الحقل بشكل شيك (مثلا: first_name -> First name)
                if field == "non_field_errors" or field == "detail":
                    error_messages.append(error_text)
                else:
                    field_name = field.replace('_', ' ').capitalize()
                    error_messages.append(f"{field_name}: {error_text}")
            
            # بنجمع الأخطاء كلها في سطر واحد مفصولين بنقطة أو شرطة
            detailed_message = " | ".join(error_messages)
            
        elif isinstance(original_data, list):
            # لو الخطأ راجع كلستة مباشرة
            detailed_message = " ".join([str(e) for e in original_data])
        elif isinstance(original_data, str):
            # لو الخطأ نص مباشر
            detailed_message = original_data

        # 2. تغليف الرد بالشكل النهائي
        response.data = {
            "error": "Request Failed", 
            "message": detailed_message,  # الرسالة الديناميكية التفصيلية
            "details": original_data      # بنسيب التفاصيل الأصلية زي ما هي لو الفرونت حابب يستخدمها
        }

    return response