"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Award, BarChart, TrendingUp } from "lucide-react"
import { translateSegmentName } from "@/utils/rfmFunctionHelper"

type Segment = {
    name: string
    percentage: string
}

interface StrategyDialogProps {
    selectedSegment: Segment | null
    onClose: () => void
}

const marketingStrategies: Record<string, Record<string, object>> = {
    "Champions": {
        "0-25%": {
            "rate": "Bình thường, cần giữ vững",
            "suggest": "Duy trì tần suất liên lạc phù hợp và cung cấp quyền lợi VIP để giữ chân khách hàng.\nGửi quà cảm ơn nhỏ, khuyến khích feedback và chia sẻ trải nghiệm."
        },
        "26-50%": {
            "rate": "Tốt, có thể phát triển thêm",
            "suggest": "Tri ân bằng các món quà nhỏ hoặc ưu đãi độc quyền theo mùa.\nTạo cộng đồng riêng cho khách hàng trung thành, ưu đãi thử sản phẩm mới trước."
        },
        "51-75%": {
            "rate": "Rất tốt, bắt đầu thêm nhiều ưu đãi hơn",
            "suggest": "Tạo chương trình giới thiệu bạn bè và ưu đãi hoàn tiền.\nPhát triển chương trình đại sứ thương hiệu và referral (giới thiệu bạn bè nhận thưởng)."
        },
        "76-100%": {
            "rate": "Tuyệt vời, dấu hiệu doanh nghiệp khỏe mạnh — duy trì & khai thác triệt để",
            "suggest": "Tổ chức các buổi họp mặt hoặc sự kiện đặc biệt dành riêng cho họ.\nCá nhân hóa sâu toàn bộ hành trình mua hàng, tiếp cận bằng nội dung độc quyền, mời họ dự event thương hiệu."
        },
    },
    "Loyal Customers": {
        "0-25%": {
            "rate": "Cần cải thiện giữ chân",
            "suggest": "Khuyến khích họ chia sẻ đánh giá và phản hồi sản phẩm.\nĐánh giá lại hành trình giữ chân và cải thiện dịch vụ hậu mãi."
        },
        "26-50%": {
            "rate": "Ổn, nên cá nhân hóa nhiều hơn",
            "suggest": "Cung cấp nội dung cá nhân hóa theo hành vi mua hàng.\nGửi mã giảm giá theo dịp cá nhân (sinh nhật, ngày đặc biệt)."
        },
        "51-75%": {
            "rate": "Tốt, triển khai loyalty sâu hơn",
            "suggest": "Tăng dần ưu đãi mỗi lần mua hàng hoặc theo mốc chi tiêu.\nCung cấp chương trình tích điểm và đổi quà theo mức độ chi tiêu."
        },
        "76-100%": {
            "rate": "Tốt, thể hiện khả năng giữ chân cao — nên xây hệ thống xếp hạng/hội viên",
            "suggest": "Tạo chương trình tích điểm với phần thưởng hấp dẫn.\nXây dựng hệ thống xếp hạng hạng mức thành viên (silver, gold, platinum)."
        },
    },
    "Potential Loyalist": {
        "0-25%": {
            "rate": "Nên nurture thêm",
            "suggest": "Tạo chiến dịch nurture với ưu đãi nhẹ (giảm giá 5–10%) và nội dung mang tính giáo dục, thúc đẩy lần mua tiếp theo."
        },
        "26-50%": {
            "rate": "Có tiềm năng — cần thúc đẩy hành vi trung thành",
            "suggest": "Đầu tư vào chương trình khách hàng thân thiết, khuyến khích đăng ký tài khoản và đánh giá sản phẩm."
        },
        "51-75%": {
            "rate": "Đang chuyển đổi tốt, cần cá nhân hóa",
            "suggest": "Cá nhân hóa thông điệp và tặng mã giảm giá cá nhân; bắt đầu các chương trình giới thiệu bạn bè."
        },
        "76-100%": {
            "rate": "Rất tốt, cần duy trì & phát triển dài hạn",
            "suggest": "Tổ chức các sự kiện tri ân riêng cho nhóm này; cung cấp các lợi ích đặc quyền để giữ chân."
        },
    },
    "New Customers": {
        "0-25%": {
            "rate": "Bình thường",
            "suggest": "Gửi email cảm ơn và hướng dẫn sử dụng sản phẩm chi tiết.\nTạo onboarding email rõ ràng, giải thích cách mua và chính sách đổi trả."
        },
        "26-50%": {
            "rate": "Ổn, cần push email/series giới thiệu",
            "suggest": "Cung cấp mã giảm giá cho lần mua tiếp theo.\nGửi email series hướng dẫn, giới thiệu sản phẩm bán chạy và nhận xét của người mua cũ."
        },
        "51-75%": {
            "rate": "Có dấu hiệu thích sản phẩm — nên upsell nhanh",
            "suggest": "Mời tham gia group cộng đồng khách hàng để tăng gắn kết.\nĐẩy mạnh email upsell + cung cấp phiếu giảm giá cho đơn tiếp theo."
        },
        "76-100%": {
            "rate": "Tốt, cần gấp rút chuyển hóa sang nhóm trung thành",
            "suggest": "Giới thiệu các sản phẩm liên quan kèm ưu đãi combo.\nTối ưu hành trình từ lần đầu mua đến trung thành: xây loyalty program ngay từ đầu."
        },
    },
    "Promising": {
        "0-25%": {
            "rate": "Thấp — cần chăm sóc để không bị “lụi tàn”",
            "suggest": "Giới thiệu sản phẩm nổi bật và lợi ích chính qua chuỗi email.\nGửi email gợi ý mua hàng tiếp theo, sản phẩm liên quan."
        },
        "26-50%": {
            "rate": "Có động lực nếu push nhẹ",
            "suggest": "Tạo chiến dịch upsell hoặc bundle khuyến mãi nhẹ.\n Tặng ưu đãi nhỏ nếu mua lần 2 trong 7 ngày."
        },
        "51-75%": {
            "rate": "Có thể upsell, tạo tương tác nhanh",
            "suggest": "Mời tham gia sự kiện/livestream giới thiệu sản phẩm.\nMời tham gia mini game tặng quà để tăng tương tác."
        },
        "76-100%": {
            "rate": "Tốt, đang sẵn sàng nâng cấp lên Loyalist hoặc Champion",
            "suggest": "Khuyến khích theo dõi kênh social và tham gia mini game.\nƯu tiên upsell/cross-sell theo lịch sử sản phẩm đã mua."
        },
    },
    "Need Attention": {
        "0-25%": {
            "rate": "An toàn — chỉ cần giữ nhịp độ nội dung gợi nhắc",
            "suggest": "Gửi survey ngắn để thu thập lý do giảm tương tác.\nGửi reminder với gợi ý sản phẩm dựa trên hành vi đã có."
        },
        "26-50%": {
            "rate": "Bắt đầu có dấu hiệu giảm tương tác",
            "suggest": "Tạo ưu đãi quay lại giới hạn thời gian (flash sale cá nhân).\nGửi mã giảm giá cá nhân hóa để kích thích tương tác lại."
        },
        "51-75%": {
            "rate": "Đáng lưu ý, nên áp dụng retargeting",
            "suggest": "Đề xuất gói combo giá trị cao kèm quà tặng.\nThử quảng cáo retargeting và kênh SMS song song email."
        },
        "76-100%": {
            "rate": "Đáng báo động, cần chăm sóc cá nhân hoá nhiều hơn",
            "suggest": "Thực hiện remarketing bằng quảng cáo cá nhân hóa.\nDùng CSKH để gọi lại hoặc mời khảo sát để hiểu lý do giảm tương tác."
        },
    },
    "About To Sleep": {
        "0-25%": {
            "rate": "Ổn, chỉ cần khơi gợi nhẹ",
            "suggest": "Nhắc nhở nhẹ nhàng qua email về sản phẩm đã từng mua.\nGửi nội dung khơi gợi sự quan tâm, như sản phẩm mới và bài blog."
        },
        "26-50%": {
            "rate": "Cảnh báo nhẹ — nên có chiến dịch làm mới trải nghiệm",
            "suggest": "Gửi mã giảm giá có hạn sử dụng trong 24–48h.\nMời dùng thử sản phẩm mới kèm ưu đãi nhẹ."
        },
        "51-75%": {
            "rate": "Đang ngủ dần — cần hành động ngay",
            "suggest": "Tạo nội dung FOMO (sắp hết hàng, ưu đãi cuối cùng).\nGửi thông báo “chúng tôi nhớ bạn” kèm mã giảm giá có thời hạn."
        },
        "76-100%": {
            "rate": "Nguy cơ cao — cần chiến dịch đánh thức & tái kích hoạt mạnh mẽ",
            "suggest": "Chạy chiến dịch nhắc lại đa kênh (email, SMS, Facebook Ads).\nGọi điện nhắc nhở hoặc tổ chức chiến dịch “thức tỉnh” bằng quà tặng miễn phí."
        },
    },
    "At Risk": {
        "0-25%": {
            "rate": "Bình thường, nhắc nhẹ",
            "suggest": "Tạo chiến dịch phản hồi với quà tặng bất ngờ để gây chú ý.\nGửi nhắc nhở nhẹ nhàng, ưu đãi quay lại kèm sản phẩm tương tự lần mua trước."
        },
        "26-50%": {
            "rate": "Đang rời rạc — cần ưu đãi & khẩn cấp hóa thông điệp",
            "suggest": "Ưu đãi có thời hạn để tạo cảm giác khẩn cấp + nội dung “bạn sắp bỏ lỡ”."
        },
        "51-75%": {
            "rate": "Đáng báo động, phải remarketing đồng loạt",
            "suggest": "Tích hợp email, SMS và quảng cáo đồng thời để khơi lại tương tác."
        },
        "76-100%": {
            "rate": "Rất nguy hiểm! Tỉ trọng cao ở đây là báo động đỏ — ưu tiên cứu vớt nhóm này",
            "suggest": "Đầu tư vào chăm sóc cá nhân (tele-sale, CSKH riêng) để giữ chân, áp dụng chiến lược “chăm sóc VIP”."
        },
    },
    "Can't Lose Them": {
        "0-25%": {
            "rate": "Tốt, đang ít nhưng quan trọng",
            "suggest": "Liên hệ cá nhân hóa từ CSKH để chăm sóc riêng.\nGửi email thăm hỏi, offer hoàn tiền hoặc đổi sản phẩm nếu không hài lòng."
        },
        "26-50%": {
            "rate": "Có thể cứu bằng ưu đãi và khảo sát",
            "suggest": "Tạo deal độc quyền chỉ dành cho họ.\nMời tham gia khảo sát + mã giảm 20%."
        },
        "51-75%": {
            "rate": "Quan trọng — cần chăm sóc cá nhân hóa",
            "suggest": "Tổ chức sự kiện khách hàng VIP kèm thư mời đặc biệt.\nÁp dụng combo: ưu đãi – quà tặng – lời cảm ơn."
        },
        "76-100%": {
            "rate": "Rất đáng báo động với tỉ trọng cao — mất họ có thể mất nhiều giá trị",
            "suggest": "Cung cấp dịch vụ hậu mãi cao cấp miễn phí để giữ chân.\n Dùng chăm sóc đặc biệt (CSKH riêng, gọi điện, ưu đãi VIP)."
        },
    },
    "Lost": {
        "0-25%": {
            "rate": "Ổn nếu tỉ trọng thấp, có thể bỏ qua 1 phần",
            "suggest": "Gửi email khảo sát để tìm hiểu nguyên nhân mất khách và cải thiện sản phẩm/dịch vụ."
        },
        "26-50%": {
            "rate": "Nên triển khai win-back có chọn lọc",
            "suggest": "Gửi chiến dịch win-back với ưu đãi đặc biệt (50% giảm giá/miễn phí vận chuyển)."
        },
        "51-75%": {
            "rate": "Mất nhiều — cần remarketing mạnh",
            "suggest": "Chạy chiến dịch remarketing trên mạng xã hội + email chuỗi khuyến mãi gia tăng."
        },
        "76-100%": {
            "rate": "Cực kỳ nguy hiểm — mất mát lớn, cần cải tổ chiến lược giữ chân",
            "suggest": "Cần cải tổ toàn bộ chiến lược giữ chân và CSKH, phối hợp call center để gọi lại khách hàng cũ."
        },
    },
    "Hibernating": {
        "0-25%": {
            "rate": "Bình thường — chỉ “ngủ đông” chưa chắc mất",
            "suggest": "Gửi lại email với lời chào thân thiện hoặc cập nhật sản phẩm mới.\nkhông dùng khuyến mãi mạnh."
        },
        "26-50%": {
            "rate": "Có thể đánh thức bằng ưu đãi nhẹ",
            "suggest": "Mời tham gia chương trình thử sản phẩm miễn phí.\nChiến dịch “Chào mừng trở lại” kèm ưu đãi + sản phẩm mới."
        },
        "51-75%": {
            "rate": "Cần truyền thông lại — social & email",
            "suggest": "Tặng voucher sinh nhật hoặc dịp đặc biệt.\nDùng retargeting, email, social để khơi gợi."
        },
        "76-100%": {
            "rate": "Rủi ro cao, phải tìm nguyên nhân sâu và cải tổ hành trình",
            "suggest": "Tạo chiến dịch 'Chúng tôi nhớ bạn' cá nhân hóa.\nĐầu tư khảo sát tìm lý do ngủ đông, tái cấu trúc lại hành trình."
        },
    }
}
export function StrategyDialog({ selectedSegment, onClose }: StrategyDialogProps) {
    if (!selectedSegment) return null

    const { name, percentage } = selectedSegment
    const strategies = marketingStrategies[name]
    const perc = Number.parseInt(percentage)
    const range = perc <= 25 ? "0-25%" : perc <= 50 ? "26-50%" : perc <= 75 ? "51-75%" : ("76-100%")

    const message = strategies?.[range]?.["suggest"] ?? "Chưa có chiến lược cho nhóm này."
    const rate = strategies?.[range]?.["rate"] ?? "Chưa có đánh giá cho nhóm này."
    // Determine badge color based on percentage range\
    const goodSegments = [
        "Champions",
        "Loyal Customers",
        "Potential Loyalist",
        "Promising",
        "New Customers"
    ]

    const badSegments = [
        "Lost",
        "At Risk",
        "Hibernating",
        "About To Sleep"
    ]

    const neutralSegments = [
        "Need Attention",
        "Can't Lose Them"
    ]

    const getBadgeColor = (range: string, segment: string): string => {
        const isGood = goodSegments.includes(segment)
        const isBad = badSegments.includes(segment)
        const isNeutral = neutralSegments.includes(segment)

        if (isGood) {
            switch (range) {
                case "0-25%":
                    return "bg-red-100 text-red-800 hover:bg-red-100"
                case "26-50%":
                    return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                case "51-75%":
                    return "bg-blue-100 text-blue-800 hover:bg-blue-100"
                case "76-100%":
                    return "bg-green-100 text-green-800 hover:bg-green-100"
                default:
                    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
        }

        if (isBad) {
            switch (range) {
                case "0-25%":
                    return "bg-green-100 text-green-800 hover:bg-green-100"
                case "26-50%":
                    return "bg-blue-100 text-blue-800 hover:bg-blue-100"
                case "51-75%":
                    return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                case "76-100%":
                    return "bg-red-100 text-red-800 hover:bg-red-100"
                default:
                    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
        }

        if (isNeutral) {
            switch (range) {
                case "0-25%":
                    return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                case "26-50%":
                    return "bg-blue-100 text-blue-800 hover:bg-blue-100"
                case "51-75%":
                    return "bg-purple-100 text-purple-800 hover:bg-purple-100"
                case "76-100%":
                    return "bg-green-100 text-green-800 hover:bg-green-100"
                default:
                    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
        }

        // fallback nếu không thuộc phân khúc nào
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }

    // Format the message with proper line breaks for display
    const formatMessage = (text: string) => {
        return text.split("\n").map((line, i) => (
            <p key={i} className="py-1">
                {line}
            </p>
        ))
    }

    return (
        <Dialog open={!!selectedSegment} onOpenChange={onClose}>
            <DialogContent className="max-w-lg sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Gợi ý chiến lược quảng bá
                    </DialogTitle>
                </DialogHeader>

                <Card className="border-0 shadow-none">
                    <CardContent className="p-0">
                        <div className="grid gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted/50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Nhóm phân khúc</h3>
                                    <p className="text-lg font-semibold">{translateSegmentName(name)}</p>
                                </div>
                                <Badge className={`${getBadgeColor(range, name)} px-3 py-1 text-xs font-medium`}>{percentage}</Badge>
                            </div>

                            <div className="space-y-4 px-1">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <BarChart className="h-4 w-4 text-primary" />
                                        <h3 className="font-medium">Đánh giá tỉ trọng</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-6">{rate}</p>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                        <h3 className="font-medium">Gợi ý chiến lược</h3>
                                    </div>
                                    <div className="text-sm text-muted-foreground pl-6 space-y-1">{formatMessage(message)}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={onClose}>Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
