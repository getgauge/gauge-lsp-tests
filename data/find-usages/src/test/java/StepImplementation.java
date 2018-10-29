import com.thoughtworks.gauge.*;

public class StepImplementation {

    @Step("Vowels in English language are <vowelString>.")
    public void setLanguageVowels(String vowelString) {
    }

    @Step("The word <word> has <expectedCount> vowels.")
    public void verifyVowelsCountInWord(String word, int expectedCount) {
    }

    @Step("Almost all words have vowels <wordsTable>")
    public void verifyVowelsCountInMultipleWords(Table wordsTable) {
    }

    @Step("Zero references <table>")
    public void VerifyVowelsCountInWord(String word, int expectedCount)
    {
    }
}
