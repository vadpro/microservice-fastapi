# coding=utf-8

import re
import inspect
from collections import OrderedDict

import datetime


def prn(value, level=0, is_log=0):
    # ADD TO PRN
    # for key in inspect.getmembers(AnyClass):

    # if not DEBUG:
    #     return False

    max_level_show = 1

    def is_last_level(value):
        if isinstance(value, (float, int, str)):
            return 1
        return 0

    def print_like_string(value):
        output = ''
        if isinstance(value, (float, int, str, bool,)):
            output = u"%s(%s)" % (value, type(value))
        if isinstance(value, (list, dict, set, tuple)):
            output = u"%s(%s)" % (value, type(value))

        if isinstance(value, (datetime.time, datetime.date)):
            output = u"%s(%s)" % (value, type(value))

        if not output:
            try:
                output = u"%s(%s)" % (value, type(value))
            except (TypeError, ):
                prn(value)
        # print(type(value))
        return output

    if level == 0:
        print('')
        frame = inspect.currentframe()
        try:
            context = inspect.getframeinfo(frame.f_back).code_context
            try:
                caller_lines = ''.join([line.strip() for line in context])
            except TypeError:
                caller_lines = str(context)
            m = re.search(r'echo\s*\((.+?)\)$', caller_lines)
            if m:
                caller_lines = m.group(1)
            output = "********************   " + caller_lines.replace('prn(', '')[:-1] + "  ***********************"
            print(output)
            print(type(value))
        finally:
            del frame
    level_str = '   '
    cur_level = level
    while level != 0:
        level_str += '   '
        level -= 1

    if isinstance(value, (list, set, tuple)):
        if not value:
            print(print_like_string(value))
        for key, sub_value in enumerate(value):
            output = level_str + '[' + str(key) + '] = ' + print_like_string(sub_value)
            print(output)
            if cur_level < max_level_show and not is_last_level(sub_value):
                prn(sub_value, cur_level + 1, is_log)
    elif isinstance(value, (dict, OrderedDict)):
        if not value:
            print(print_like_string(value))

        if get_type(value) == 'query_dict':
            # to print query_dict, need to convert in other way
            value = dict(value)

        for key in list(value):
            # for key, sub_value in value.items():
            sub_value = value[key]
            output = level_str + '[' + str(key) + '] = ' + print_like_string(sub_value)
            print(output)

            if cur_level < max_level_show and not is_last_level(sub_value):
                prn(sub_value, cur_level + 1, is_log)
    else:
        # string_print = print_like_string(value)
        # if string_print:
        value_type = get_type(value)
        if value_type == 'model':
            # print django model
            clean_fields = {}
            for key, item in value.__dict__.items():
                if not key.startswith('_'):
                    clean_fields[key] = item
            prn(clean_fields, cur_level + 1, is_log)

        # elif value_type == 'model_query':
        #     print_database_query_formatted(value)

        elif value_type == 'date':
            print("%s(%s)" % (value, type(value)))

        elif value_type == 'queryset':
            # print django queryset
            for one_record in value:
                print('')
                print(print_like_string(one_record))
                prn(one_record, cur_level + 1, is_log)
            print('Count records in queryset: %s' % value.count())
        else:
            if isinstance(value_type, (str)):
                print(print_like_string(value))
            else:
                # TODO FOR SPECIAL CLASSES OUTPUT
                if '<class' in str(value_type):
                    if hasattr(value, '__dict__'):
                        prn(value.__dict__, cur_level + 1, is_log)
                    else:
                        print(print_like_string(value))
                    # for attr_name in dir(value):
                    #     try:
                    #         attr_value = getattr(value, attr_name)
                    #     except AttributeError:
                    #         pass
                    #     if get_type(attr_value) not in ['function_or_method', 'method']:
                    #         output = level_str + '[' + str(attr_name) + '] = ' + print_like_string(attr_value)
                    #         print(output)
                else:
                    print(print_like_string(value))

    if cur_level == 0:
        output = '**********************************************************************'
        print(output)
        print(' ')
    return True


def get_type(value):
    type_result = ''
    if isinstance(value, bool):
        return 'bool'

    value_type_str = str(type(value))

    if "<class 'django.http.request.QueryDict'>" in value_type_str:
        return 'query_dict'

    if isinstance(value, (float, int, str, list, dict, set, tuple)):
        return value_type_str

    if '<class' in value_type_str and ('.models.sql.query.' in value_type_str or 'safedelete.query.SafeDeleteQuery' in value_type_str):
        type_result = 'model_query'
    elif "<class '" in value_type_str and "queryset'>" in value_type_str.lower():
        type_result = 'queryset'
    elif "<class '" in value_type_str and "multilingual_queryset_factory" in value_type_str.lower():
        type_result = 'queryset'
    elif '<class' in value_type_str and '.models.' in value_type_str:
        type_result = 'model'
    elif 'builtin_function_or_method' in value_type_str:
        type_result = 'builtin_function_or_method'
    elif "<class 'method'" in value_type_str:
        type_result = 'method'
    elif "<class 'datetime.date'>" in value_type_str:
        type_result = 'date'
    elif "<class 'django.contrib.gis.geos.point.Point'>" in value_type_str:
        type_result = 'geo_point'

    if not type_result:
        print('type str = "%s"' % value_type_str)
        type_result = type(value)

    return type_result
