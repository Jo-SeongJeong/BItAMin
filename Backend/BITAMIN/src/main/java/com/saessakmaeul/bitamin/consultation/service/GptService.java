package com.saessakmaeul.bitamin.consultation.service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.saessakmaeul.bitamin.config.GptConfig;
import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultation.dto.request.GptCompletion;
import com.saessakmaeul.bitamin.consultation.dto.request.GptRequest;
import com.saessakmaeul.bitamin.consultation.dto.response.GptResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class GptService {

    private final GptConfig gptConfig;

    @Value("${openai.model}")
    private String modelUrl;

    @Value("${openai.api.url}")
    private String promptUrl;

    public GptResponse prompt(SearchCondition category, String nickname, GptCompletion gptCompletion) {
        gptCompletion.setModel("gpt-4o-mini");

        switch (category) {
            case 음악 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 서로 좋아하는 음악을 소개해 볼까요? 소개가 끝나면 함께 들어봐요!\n" +
                        "4. 진짜 좋은 곡들이 많군요! 음악의 힘은 정말 대단한 것 같아요! 저도 힘들 때 음악을 들으면 내가 공감받고 있다는 느낌을 받거든요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "5. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 미술 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 그림판을 이용해 그림을 그려 볼까요? 어떤 그림이든 좋아요! 다 그리면 진행 버튼을 눌러주세요!\n" +
                        "4. " + nickname + "님부터 한 분씩 화면공유를 통해 그림에 관해 설명해주세요!\n" +
                        "5. 정말 예쁜 그림이네요! 그림을 그리면서, 서로의 그림에 대해 대화를 나누면서 재미있는 시간이 되었을 거라고 생각해요! 그림을 그리며 마음을 차분히 가라앉히는 건 뜻 깊은 시간이거든요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "6. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 영화 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 서로 좋아하는 영화를 소개해 볼까요? 이 영화를 소개한 이유도 꼭 같이 이야기 해주세요!\n" +
                        "4. 모두 한 번씩 감상하셨으면 좋겠어요! 재미있게 시간을 보낼 수 있는 영화를 보면서 스트레스를 날릴 수 있고, 공감할 수 있는 영화를 본다면, 나의 감정을 이해할 수도 있을거예요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "5. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 독서 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 서로 감명 깊게 읽었던 책을 소개해 볼까요? 책 줄거리와, 느낀 점 위주로 이야기하면 좋을 것 같아요!\n" +
                        "4. 독서와 책 소개는 정서적, 사회적, 지적 측면에서 긍정적인 효과가 있다고 해요! 오늘 대화를 들어보니, 정말 그런 것 같아 신기하네요! 같은 책이더라도 다양한 해석이 나올 수 있다는 것도 너무 매력적이지 않나요? 오늘 소개받은 책을 읽어보기를 바랄게요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "5. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 대화 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "번호를 이야기하면 여기에 정리해 놓은 번호에 대한 문장을 그대로 답변해 줘.\n" +
                        "1. 안녕하세요. 저는 여러분과 함께 시간을 보낼 귤귤이에요! 지금부터 함께 상담을 시작해 볼까요?\n" +
                        "2. 먼저, 우리 " + nickname + "님부터 이번 주 나의 감정이 어땠는지 되돌아봐요! 좋았던 기억, 힘들었던 일 등 어떤 주제도 좋으니 이야기해 주세요!\n" +
                        "3. 모두 한 주간 고생 많았어요! 대화를 통해 내가 어떤 생각을 했었는지를 알아보는 시간이 되었길 바라요. 이번에는 내가 평소에 하고 싶었던 말을 여기에 꺼내봐요. 하고 싶지만, 할 수 없었던 말, 참아왔던 말, 혹은 칭찬이나 공감받고 싶었던 이야기도 좋아요!\n" +
                        "4. 용기 내주어서 고마워요! 털어놓으니, 마음이 한결 가벼워지지 않았나요? 아니면, 마음이 따뜻해지지 않았나요? 나를 표현하는 건 정말 중요한 일이에요! 이렇게 조금씩 용기를 내며 연습하면 내 자존감도 올라갈거예요! 마지막으로 오늘 상담이 어땠는지 서로 이야기해 봐요!\n" +
                        "5. 이제 인사하고 마무리할게요! 뜻깊은 시간이 되었기를 바라요. 오늘 함께 했던 분과 다음에도 상담하고 싶다면, 쪽지를 보내 약속을 잡아도 좋아요! 다음에 만날 때까지 행복한 하루 보내세요!"));
                break;
            case 요약 :
                gptCompletion.getMessages().add(0, new GptRequest("system", "앞으로 사용자가 전달한 말에 대한 요약을 해줘. 추가로 다른 단락에 응원하는 말도 넣어줘."));
                break;
        }

        System.out.println("[+] 신규 프롬프트를 수행합니다.");

        Map<String, Object> resultMap = new HashMap<>();

        // 토큰 정보가 포함된 Header 가져옴.
        HttpHeaders headers = gptConfig.httpHeaders();

        // 통신을 위한 RestTemplate을구성
        HttpEntity<GptCompletion> requestEntity = new HttpEntity<>(gptCompletion, headers);
        ResponseEntity<String> response = gptConfig
                .restTemplate()
                .exchange(promptUrl, HttpMethod.POST, requestEntity, String.class);
        try {
            // String -> HashMap 역직렬화를 구성합니다.
            ObjectMapper om = new ObjectMapper();
            resultMap = om.readValue(response.getBody(), new TypeReference<>() {
            });
            System.out.println("chatGpt resultMap 체크:"+resultMap);
        } catch (JsonProcessingException e) {
        	System.out.println("JsonMappingException :: " + e.getMessage());
        } catch (RuntimeException e) {
        	System.out.println("RuntimeException :: " + e.getMessage());
        }

        // html 문법 고려한 parsing
        String text = (String)((Map)((Map)((List)resultMap.get("choices")).get(0)).get("message")).get("content");
        text = text.replace("\n", "<br />");
        text = text.replaceAll("\\*\\*(.*?)\\*\\*", "<strong>$1</strong>");

        System.out.println("text : " + text);
        
        return new GptResponse("assistant", text);
    }
}