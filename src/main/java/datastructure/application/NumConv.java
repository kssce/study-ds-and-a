package datastructure.application;

public class NumConv {

    private static String convHex (int num, int convNum) {
        return (num > 9 && convNum > 10) ? Character.toString((char)(num + 55)) : num + "";
    }

    public static String convert (int targetNum, int convNum) {
        int dividend = (int)Math.floor(targetNum / convNum);

        if (dividend <= 0) return convHex(targetNum, convNum);

        String remainder = convHex((targetNum % convNum), convNum);
        return convert(dividend, convNum) + remainder;
    }
}
