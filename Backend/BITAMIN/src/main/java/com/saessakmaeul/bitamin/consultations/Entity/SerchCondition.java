package com.saessakmaeul.bitamin.consultations.Entity;

public enum SerchCondition {
    전체,
    음악,
    미술,
    영화,
    독서,
    대화,
    비밀방;

    public static SerchCondition fromString(String value) {
        try {
            return SerchCondition.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(value + " is not a valid serch condition");
        }
    }
}
