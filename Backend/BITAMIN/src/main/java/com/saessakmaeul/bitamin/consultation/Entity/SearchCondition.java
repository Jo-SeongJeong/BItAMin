package com.saessakmaeul.bitamin.consultation.Entity;

public enum SearchCondition {
    전체,
    음악,
    미술,
    영화,
    독서,
    대화,
    비밀방,
    요약;

    public static SearchCondition fromString(String value) {
        try {
            return SearchCondition.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(value + " is not a valid serch condition");
        }
    }
}
